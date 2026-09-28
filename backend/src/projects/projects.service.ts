import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Project } from './project.entity';
import { ProjectImage } from './project-image.entity';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectImage)
    private readonly projectImageRepository: Repository<ProjectImage>,
  ) {}

  async onModuleInit() {
    const count = await this.projectRepository.count();
    if (count === 0) {
      console.log('Seeding initial project placeholders...');
      const projects: Partial<Project>[] = [
        {
          title: 'Untitled Project I',
          category: 'Residential',
          location: 'Tokyo, Japan',
          year: 2024,
          thumbnailUrl: null,
          description:
            'A study in minimalist concrete structure and light well integration. This residential pavilion explores the intersection of monolithic walls and fluid spatial boundaries, utilizing raw textures and shadows as primary aesthetic drivers.',
          cubeIndex: 5,
        },
        {
          title: 'Untitled Project II',
          category: 'Cultural',
          location: 'Copenhagen, Denmark',
          year: 2025,
          thumbnailUrl: null,
          description:
            'An open-air pavilion designed to blend into the surrounding coastal landscape. The project features a floating timber grid structure that filters sunlight to create a dynamic play of patterns on the stone floor below.',
          cubeIndex: 12,
        },
        {
          title: 'Untitled Project III',
          category: 'Commercial',
          location: 'Jakarta, Indonesia',
          year: 2026,
          thumbnailUrl: null,
          description:
            'A research on biophilic workspaces in dense tropical urban settings. By carving out a series of vertical micro-courtyards, the building facilitates natural cross-ventilation and brings localized flora to every work desk.',
          cubeIndex: 20,
        },
        {
          title: 'Untitled Project IV',
          category: 'Residential',
          location: 'Berlin, Germany',
          year: 2023,
          thumbnailUrl: null,
          description:
            'Renovation and extension of an industrial brick warehouse. The new volume rests like a light glass lantern above the existing brick plinth, bridging historical weight with contemporary transparency.',
          cubeIndex: 28,
        },
        {
          title: 'Untitled Project V',
          category: 'Institutional',
          location: 'Melbourne, Australia',
          year: 2027,
          thumbnailUrl: null,
          description:
            'A community library concept designed as a series of timber reading rooms gathered around a central light-filled atrium. The structural grid is left exposed to showcase local sustainable engineering.',
          cubeIndex: 35,
        },
      ];
      await this.projectRepository.save(projects as Project[]);
      console.log('Successfully seeded 5 project placeholders.');
    }
  }

  private ensureThumbnailInImages(project: Project | null): Project | null {
    if (!project) return null;
    if (project.thumbnailUrl && (!project.images || project.images.length === 0)) {
      project.images = [
        {
          id: -project.id,
          imageUrl: project.thumbnailUrl,
          order: 0,
          isCover: true,
          project: project,
        } as ProjectImage,
      ];
    }
    return project;
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      relations: { images: true },
      order: { id: 'DESC' },
    });
    return projects.map((p) => this.ensureThumbnailInImages(p)!);
  }

  async findOne(id: number): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    return this.ensureThumbnailInImages(project);
  }

  async getPaneStatus(): Promise<{ cubeIndex: number; projectId: number; title: string }[]> {
    const projects = await this.projectRepository.find({
      select: { id: true, title: true, cubeIndex: true },
    });
    return projects
      .filter((p) => p.cubeIndex !== null && p.cubeIndex !== undefined)
      .map((p) => ({ cubeIndex: p.cubeIndex!, projectId: p.id, title: p.title }));
  }

  async handleCubeIndexConflict(cubeIndex: number | null | undefined, currentProjectId?: number) {
    if (cubeIndex !== null && cubeIndex !== undefined) {
      const whereCondition = currentProjectId
        ? { cubeIndex, id: Not(currentProjectId) }
        : { cubeIndex };
      const conflictingProject = await this.projectRepository.findOne({ where: whereCondition });
      if (conflictingProject) {
        conflictingProject.cubeIndex = null;
        await this.projectRepository.save(conflictingProject);
      }
    }
  }

  async create(projectData: Partial<Project>, imageUrls: string[] = [], coverIndex = 0): Promise<Project> {
    await this.handleCubeIndexConflict(projectData.cubeIndex);

    const project = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(project);

    if (imageUrls.length > 0) {
      const images: ProjectImage[] = imageUrls.map((url, idx) => {
        return this.projectImageRepository.create({
          imageUrl: url,
          order: idx,
          isCover: idx === coverIndex,
          project: savedProject,
        });
      });
      await this.projectImageRepository.save(images);

      const coverImage = images.find((img) => img.isCover) || images[0];
      savedProject.thumbnailUrl = coverImage ? coverImage.imageUrl : null;
      await this.projectRepository.save(savedProject);
    }

    return this.findOne(savedProject.id) as Promise<Project>;
  }

  async update(
    id: number,
    projectData: Partial<Project>,
    newImageUrls: string[] = [],
    coverImageIdOrIndex?: number | string,
    keepImageIds?: number[],
  ): Promise<Project> {
    const existing = await this.projectRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.handleCubeIndexConflict(projectData.cubeIndex, id);

    // 1. Fetch current database images for this project ordered by order, then id
    const currentDbImages = await this.projectImageRepository.find({
      where: { project: { id } },
      order: { order: 'ASC', id: 'ASC' },
    });

    let imagesAfterRemoval: ProjectImage[] = [...currentDbImages];

    // 2. Perform safe, explicit ID-based diff if keepImageIds is provided
    if (keepImageIds !== undefined) {
      const keepIdSet = new Set<number>(
        keepImageIds.map(Number).filter((n) => !isNaN(n) && n > 0),
      );

      // Explicit diff: photos in DB that are NOT in keepIdSet must be removed
      const imagesToDelete = currentDbImages.filter((img) => !keepIdSet.has(img.id));
      imagesAfterRemoval = currentDbImages.filter((img) => keepIdSet.has(img.id));

      for (const img of imagesToDelete) {
        // SAFETY DOUBLE-CHECK: verify imageId is NOT in keepIdSet
        if (keepIdSet.has(img.id)) {
          console.warn(`[SAFETY ABORT] Prevented deletion of image ID ${img.id}: present in keepIdSet!`);
          continue;
        }

        // SAFETY CHECK: Verify no other record or project references this exact file before unlinking
        const otherImageRefs = await this.projectImageRepository.count({
          where: { imageUrl: img.imageUrl, id: Not(img.id) },
        });
        const otherProjectThumbRefs = await this.projectRepository.count({
          where: { thumbnailUrl: img.imageUrl, id: Not(id) },
        });

        if (otherImageRefs === 0 && otherProjectThumbRefs === 0) {
          this.deleteFileByUrl(img.imageUrl, id, img.id);
        } else {
          console.log(
            `[IMAGE DELETE] Skipped physical file delete for "${img.imageUrl}": file is still referenced by other records (imageRefs: ${otherImageRefs}, projectThumbRefs: ${otherProjectThumbRefs})`
          );
        }

        // Delete from database record-by-record using explicit ID
        await this.projectImageRepository.delete(img.id);
        console.log(`[IMAGE DELETE] Deleted ProjectImage record ID: ${img.id} for Project ID: ${id}`);
      }
    }

    // 3. Process newly uploaded images as separate INSERT operations
    if (newImageUrls.length > 0) {
      const startOrder = imagesAfterRemoval.length;
      const createdImages = newImageUrls.map((url, idx) => {
        return this.projectImageRepository.create({
          imageUrl: url,
          order: startOrder + idx,
          isCover: false,
          project: existing,
        });
      });
      const savedNewImages = await this.projectImageRepository.save(createdImages);
      imagesAfterRemoval = [...imagesAfterRemoval, ...savedNewImages];
      console.log(`[IMAGE UPLOAD] Added ${savedNewImages.length} new images to project ID: ${id}`);
    }

    // 4. Resolve cover image and update order & isCover
    if (imagesAfterRemoval.length > 0) {
      let coverTargetId: number | null = null;
      let coverTargetIndex: number | null = null;

      if (typeof coverImageIdOrIndex === 'number') {
        if (imagesAfterRemoval.some((img) => img.id === coverImageIdOrIndex)) {
          coverTargetId = coverImageIdOrIndex;
        } else if (coverImageIdOrIndex >= 0 && coverImageIdOrIndex < imagesAfterRemoval.length) {
          coverTargetIndex = coverImageIdOrIndex;
        }
      } else if (typeof coverImageIdOrIndex === 'string') {
        const parsed = Number(coverImageIdOrIndex.trim());
        if (!isNaN(parsed)) {
          if (imagesAfterRemoval.some((img) => img.id === parsed)) {
            coverTargetId = parsed;
          } else if (parsed >= 0 && parsed < imagesAfterRemoval.length) {
            coverTargetIndex = parsed;
          }
        }
      }

      for (let i = 0; i < imagesAfterRemoval.length; i++) {
        const img = imagesAfterRemoval[i];
        let isCover = false;
        if (coverTargetId !== null) {
          isCover = img.id === coverTargetId;
        } else if (coverTargetIndex !== null) {
          isCover = i === coverTargetIndex;
        } else if (i === 0 && !imagesAfterRemoval.some((m) => m.isCover)) {
          isCover = true;
        }
        img.isCover = isCover;
        img.order = i;
        await this.projectImageRepository.save(img);
      }

      const activeCover = imagesAfterRemoval.find((img) => img.isCover) || imagesAfterRemoval[0];
      existing.thumbnailUrl = activeCover ? activeCover.imageUrl : null;
    } else {
      existing.thumbnailUrl = null;
    }

    // 5. Update basic project metadata without touching relations
    Object.assign(existing, projectData);
    delete (existing as any).images;
    await this.projectRepository.save(existing);

    return this.findOne(id) as Promise<Project>;
  }

  async removeImage(projectId: number, imageId: number): Promise<Project> {
    const image = await this.projectImageRepository.findOne({
      where: { id: imageId, project: { id: projectId } },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found for project ${projectId}`);
    }

    const otherImageRefs = await this.projectImageRepository.count({
      where: { imageUrl: image.imageUrl, id: Not(imageId) },
    });
    const otherProjectThumbRefs = await this.projectRepository.count({
      where: { thumbnailUrl: image.imageUrl, id: Not(projectId) },
    });

    if (otherImageRefs === 0 && otherProjectThumbRefs === 0) {
      this.deleteFileByUrl(image.imageUrl, projectId, imageId);
    } else {
      console.log(
        `[IMAGE DELETE] Skipped physical file delete for "${image.imageUrl}": file referenced by other records.`
      );
    }

    await this.projectImageRepository.delete(imageId);
    console.log(`[IMAGE DELETE] Deleted ProjectImage record ID: ${imageId} for Project ID: ${projectId}`);

    const remainingImages = await this.projectImageRepository.find({
      where: { project: { id: projectId } },
      order: { order: 'ASC', id: 'ASC' },
    });

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (project) {
      if (remainingImages.length > 0) {
        if (!remainingImages.some((img) => img.isCover)) {
          remainingImages[0].isCover = true;
          await this.projectImageRepository.save(remainingImages[0]);
          project.thumbnailUrl = remainingImages[0].imageUrl;
        }
      } else {
        project.thumbnailUrl = null;
      }
      delete (project as any).images;
      await this.projectRepository.save(project);
    }

    return this.findOne(projectId) as Promise<Project>;
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Delete all gallery images from disk
    if (existing.images && existing.images.length > 0) {
      for (const img of existing.images) {
        this.deleteFileByUrl(img.imageUrl, id, img.id);
      }
    } else if (existing.thumbnailUrl) {
      this.deleteFileByUrl(existing.thumbnailUrl, id);
    }

    await this.projectRepository.remove(existing);
  }

  private deleteFileByUrl(imageUrl?: string | null, projectId?: number, imageId?: number) {
    if (!imageUrl) return;

    try {
      const parts = imageUrl.split('/uploads/');
      if (parts.length > 1) {
        const fileName = parts[1];
        const filePath = join(__dirname, '..', '..', 'uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(
            `[IMAGE DELETE] Successfully deleted physical file: ${filePath} (ProjectId: ${projectId ?? 'N/A'}, ImageId: ${imageId ?? 'N/A'})`
          );
        } else {
          console.warn(
            `[IMAGE DELETE] Physical file not found on disk at: ${filePath} (ProjectId: ${projectId ?? 'N/A'}, ImageId: ${imageId ?? 'N/A'})`
          );
        }
      }
    } catch (err) {
      console.error(`[IMAGE DELETE] Failed to delete file from disk for ${imageUrl}:`, err);
    }
  }
}
