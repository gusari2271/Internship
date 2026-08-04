import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
          thumbnailUrl: undefined,
          description:
            'A study in minimalist concrete structure and light well integration. This residential pavilion explores the intersection of monolithic walls and fluid spatial boundaries, utilizing raw textures and shadows as primary aesthetic drivers.',
        },
        {
          title: 'Untitled Project II',
          category: 'Cultural',
          location: 'Copenhagen, Denmark',
          year: 2025,
          thumbnailUrl: undefined,
          description:
            'An open-air pavilion designed to blend into the surrounding coastal landscape. The project features a floating timber grid structure that filters sunlight to create a dynamic play of patterns on the stone floor below.',
        },
        {
          title: 'Untitled Project III',
          category: 'Commercial',
          location: 'Jakarta, Indonesia',
          year: 2026,
          thumbnailUrl: undefined,
          description:
            'A research on biophilic workspaces in dense tropical urban settings. By carving out a series of vertical micro-courtyards, the building facilitates natural cross-ventilation and brings localized flora to every work desk.',
        },
        {
          title: 'Untitled Project IV',
          category: 'Residential',
          location: 'Berlin, Germany',
          year: 2023,
          thumbnailUrl: undefined,
          description:
            'Renovation and extension of an industrial brick warehouse. The new volume rests like a light glass lantern above the existing brick plinth, bridging historical weight with contemporary transparency.',
        },
        {
          title: 'Untitled Project V',
          category: 'Institutional',
          location: 'Melbourne, Australia',
          year: 2027,
          thumbnailUrl: undefined,
          description:
            'A community library concept designed as a series of timber reading rooms gathered around a central light-filled atrium. The structural grid is left exposed to showcase local sustainable engineering.',
        },
      ];
      await this.projectRepository.save(projects as Project[]);
      console.log('Successfully seeded 5 project placeholders.');
    }
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOne({ where: { id } });
  }
}
