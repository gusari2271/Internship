import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

const getUploadsDestination = (req: any, file: any, cb: any) => {
  const dir = join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  cb(null, dir);
};

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get('pane-status')
  async getPaneStatus(): Promise<{ cubeIndex: number; projectId: number; title: string }[]> {
    return this.projectsService.getPaneStatus();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    const project = await this.projectsService.findOne(Number(id));
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: getUploadsDestination,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProject(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<Project> {
    const projectData: Partial<Project> = {
      title: body.title,
      category: body.category,
      location: body.location,
      year: body.year ? Number(body.year) : undefined,
      description: body.description,
      cubeIndex: body.cubeIndex !== undefined && body.cubeIndex !== '' && body.cubeIndex !== 'null' ? Number(body.cubeIndex) : null,
    };

    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrls: string[] = files
      ? files.map((file) => `${protocol}://${host}/uploads/${file.filename}`)
      : [];

    const coverIndex = body.coverIndex ? Number(body.coverIndex) : 0;
    return this.projectsService.create(projectData, imageUrls, coverIndex);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: getUploadsDestination,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProject(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<Project> {
    const projectData: Partial<Project> = {
      title: body.title,
      category: body.category,
      location: body.location,
      year: body.year ? Number(body.year) : undefined,
      description: body.description,
      cubeIndex: body.cubeIndex !== undefined && body.cubeIndex !== '' && body.cubeIndex !== 'null' ? Number(body.cubeIndex) : null,
    };

    const protocol = req.protocol;
    const host = req.get('host');
    const newImageUrls: string[] = files
      ? files.map((file) => `${protocol}://${host}/uploads/${file.filename}`)
      : [];

    let keepImageIds: number[] | undefined;
    if (body.keepImageIds) {
      if (Array.isArray(body.keepImageIds)) {
        keepImageIds = body.keepImageIds.map(Number);
      } else if (typeof body.keepImageIds === 'string') {
        keepImageIds = body.keepImageIds.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n));
      }
    }

    return this.projectsService.update(
      Number(id),
      projectData,
      newImageUrls,
      body.coverImageIdOrIndex,
      keepImageIds,
    );
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  async deleteProjectImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<Project> {
    return this.projectsService.removeImage(Number(id), Number(imageId));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProject(@Param('id') id: string): Promise<{ message: string }> {
    await this.projectsService.remove(Number(id));
    return { message: `Project with ID ${id} successfully deleted` };
  }
}
