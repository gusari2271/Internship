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

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: { images: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: { images: true },
    });
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
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.handleCubeIndexConflict(projectData.cubeIndex, id);

    // Remove images that are not in keepImageIds
    if (keepImageIds && existing.images) {
      for (const img of existing.images) {
        if (!keepImageIds.includes(img.id)) {
          this.deleteFileByUrl(img.imageUrl);
          await this.projectImageRepository.remove(img);
        }
      }
    }

    // Assign remaining/merged basic project data
    Object.assign(existing, projectData);
    await this.projectRepository.save(existing);

    // Reload remaining images
    let currentImages = await this.projectImageRepository.find({
      where: { project: { id } },
      order: { order: 'ASC' },
    });

    // Add new image URLs
    if (newImageUrls.length > 0) {
      const startOrder = currentImages.length;
      const createdImages = newImageUrls.map((url, idx) => {
        return this.projectImageRepository.create({
          imageUrl: url,
          order: startOrder + idx,
          isCover: false,
          project: existing,
        });
      });
      const savedNewImages = await this.projectImageRepository.save(createdImages);
      currentImages = [...currentImages, ...savedNewImages];
    }

    // Determine cover image
    if (currentImages.length > 0) {
      let coverTargetId: number | null = null;
      if (typeof coverImageIdOrIndex === 'number') {
        coverTargetId = coverImageIdOrIndex;
      } else if (typeof coverImageIdOrIndex === 'string' && !isNaN(Number(coverImageIdOrIndex))) {
        coverTargetId = Number(coverImageIdOrIndex);
      }

      for (let i = 0; i < currentImages.length; i++) {
        const img = currentImages[i];
        if (coverTargetId !== null) {
          img.isCover = img.id === coverTargetId;
        } else if (i === 0 && !currentImages.some((m) => m.isCover)) {
          img.isCover = true;
        }
        await this.projectImageRepository.save(img);
      }

      const coverImg = currentImages.find((img) => img.isCover) || currentImages[0];
      existing.thumbnailUrl = coverImg ? coverImg.imageUrl : null;
      await this.projectRepository.save(existing);
    } else {
      existing.thumbnailUrl = null;
      await this.projectRepository.save(existing);
    }

    return this.findOne(id) as Promise<Project>;
  }

  async removeImage(projectId: number, imageId: number): Promise<Project> {
    const image = await this.projectImageRepository.findOne({
      where: { id: imageId, project: { id: projectId } },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found for project ${projectId}`);
    }

    this.deleteFileByUrl(image.imageUrl);
    await this.projectImageRepository.remove(image);

    const project = await this.findOne(projectId);
    if (project && project.images.length > 0) {
      if (!project.images.some((img) => img.isCover)) {
        project.images[0].isCover = true;
        await this.projectImageRepository.save(project.images[0]);
        project.thumbnailUrl = project.images[0].imageUrl;
      }
    } else if (project) {
      project.thumbnailUrl = null;
    }
    if (project) {
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
        this.deleteFileByUrl(img.imageUrl);
      }
    } else if (existing.thumbnailUrl) {
      this.deleteFileByUrl(existing.thumbnailUrl);
    }

    await this.projectRepository.remove(existing);
  }

  private deleteFileByUrl(imageUrl?: string | null) {
    if (!imageUrl) return;

    try {
      const parts = imageUrl.split('/uploads/');
      if (parts.length > 1) {
        const fileName = parts[1];
        const filePath = join(__dirname, '..', '..', 'uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Successfully deleted file: ${filePath}`);
        }
      }
    } catch (err) {
      console.error('Failed to delete file from disk:', err);
    }
  }
}
