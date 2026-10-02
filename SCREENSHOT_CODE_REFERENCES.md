# SCREENSHOT CODE REFERENCES GUIDE
## BIT320 Industrial Internship Final Presentation
**Student Name:** I Putu Agus Aribawa (E2400080)  
**Host Organisation:** Code Cipta | **Client:** GRAHITA Design  
**Presentation Files:**
- [`final_presentation_internship_v2_with_code_references.pptx`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/final_presentation_internship_v2_with_code_references.pptx) *(Updated 12-slide template with embedded code paths)*
- [`final_presentation_internship_v2.pptx`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/final_presentation_internship_v2.pptx) *(Standard 12-slide presentation)*

---

### Overview of Slides Requiring Screenshots

In the 12-slide presentation template, **Slides 4, 5, 6, and 7** contain designated `[IMAGE / SCREENSHOT PLACEHOLDER]` cards. You can attach either:
1. **Live Browser Screenshots** of the running application (Angular frontend on `http://localhost:4200` or NestJS Swagger on `http://localhost:3000/api/docs`), OR
2. **VS Code Editor Screenshots** displaying the exact TypeScript source code and entity models.

Below are the exact file paths, line numbers, full code snippets, and guidance for each slide.

---

### SLIDE 4: Project Outcomes (1/4) — 3D Spatial Canvas & WebGL Sync

#### Primary Screenshot Options:
- **Option A (UI - Recommended):** Open `http://localhost:4200` (Home/Manifestation page). Screenshot the interactive Three.js 3D cube matrix with your mouse hovering over one wireframe cube, showing the active glassmorphic tooltip with the project title and spatial index.
- **Option B (Code):** Screenshot the `handleCubeIndexConflict()` algorithm and `getPaneStatus()` method in VS Code.

#### Code References:
1. **Backend Service:** [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L111-L131)  
   **Lines 111–131:**
   ```typescript
   // File Reference: backend/src/projects/projects.service.ts (Lines 111-131)
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
   ```

2. **Frontend Three.js Component:** [`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts)  
   **Key Function:** Raycasting collision detection, mouse hover event listeners, and fetching `cubeIndex` data from `ProjectService.getPaneStatus()`.

#### Key Examiner Talking Points:
- Explain that the 55 wireframe cubes in Three.js represent spatial project portals.
- Highlight the TypeORM `Not(currentProjectId)` operator, which ensures atomic disassociation so two projects never collide on the same 3D WebGL mesh coordinate.

---

### SLIDE 5: Project Outcomes (2/4) — Bilingual Architectural Portfolio & Showcase

#### Primary Screenshot Options:
- **Option A (UI - Recommended):** Open `http://localhost:4200/portfolio` or a project detail view. Take a screenshot showing the bilingual architectural metadata, category filters (Residential, Commercial, Cultural, Institutional), and responsive multi-image gallery.
- **Option B (Code):** Screenshot `project.entity.ts` and `project-image.entity.ts` side-by-side in a split VS Code editor window.

#### Code References:
1. **Primary Project Entity:** [`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L1-L33)  
   **Lines 1–33 (Complete File):**
   ```typescript
   // File Reference: backend/src/projects/project.entity.ts (Lines 1-33)
   import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
   import { ProjectImage } from './project-image.entity';

   @Entity('projects')
   export class Project {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column({ type: 'varchar', nullable: true })
     category?: string | null;

     @Column({ type: 'varchar', nullable: true })
     location?: string | null;

     @Column({ type: 'integer', nullable: true })
     year?: number | null;

     @Column({ type: 'varchar', nullable: true })
     thumbnailUrl?: string | null;

     @Column({ type: 'text', nullable: true })
     description?: string | null;

     @Column({ type: 'integer', unique: true, nullable: true })
     cubeIndex?: number | null;

     @OneToMany(() => ProjectImage, (image) => image.project, { eager: true })
     images: ProjectImage[];
   }
   ```

2. **Project Image Entity:** [`backend/src/projects/project-image.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project-image.entity.ts#L1-L22)  
   **Lines 1–22 (Complete File):**
   ```typescript
   // File Reference: backend/src/projects/project-image.entity.ts (Lines 1-22)
   import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
   import { Project } from './project.entity';

   @Entity('project_images')
   export class ProjectImage {
     @PrimaryGeneratedColumn()
     id: number;

     @Column({ type: 'varchar' })
     imageUrl: string;

     @Column({ type: 'integer', default: 0 })
     order: number;

     @Column({ type: 'boolean', default: false })
     isCover: boolean;

     @ManyToOne(() => Project, (project) => project.images, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'projectId' })
     project: Project;
   }
   ```

3. **Automated Seeder:** [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L76)  
   **Lines 18–76:** `onModuleInit()` lifecycle hook that seeds 5 sample architectural projects with full bilingual descriptions and spatial cube slots.

#### Key Examiner Talking Points:
- Emphasize the `@OneToMany` and `@ManyToOne` relationship with `onDelete: 'CASCADE'` and `eager: true` for clean relational persistence.
- Point out how `isCover` syncs with `thumbnailUrl` for efficient list views.

---

### SLIDE 6: Project Outcomes (3/4) — Secured Admin Content Management Dashboard

#### Primary Screenshot Options:
- **Option A (UI - Recommended):** Open `http://localhost:4200/admin/dashboard`. Screenshot the project catalog table showing the thumbnail covers, project titles, category tags, cube indices, edit/delete buttons, and the multi-image upload modal.
- **Option B (Code):** Screenshot `projects.controller.ts` showing the `@UseGuards(JwtAuthGuard)` decorator and Multer `FilesInterceptor` disk storage configuration.

#### Code References:
1. **Controller Route & Multer Interceptor:** [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L55-L90)  
   **Lines 55–90 (`createProject`):**
   ```typescript
   // File Reference: backend/src/projects/projects.controller.ts (Lines 55-90)
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
   ```

2. **Physical Disk Cleanup Utility:** [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272)  
   **Lines 256–272:**
   ```typescript
   // File Reference: backend/src/projects/projects.service.ts (Lines 256-272)
   private deleteFileByUrl(url: string | null | undefined) {
     if (!url) return;
     try {
       const filename = url.split('/uploads/')[1];
       if (filename) {
         const filePath = join(__dirname, '..', '..', 'uploads', filename);
         if (fs.existsSync(filePath)) {
           fs.unlinkSync(filePath);
         }
       }
     } catch (err) {
       console.error(`Failed to delete file for url: ${url}`, err);
     }
   }
   ```

#### Key Examiner Talking Points:
- Explain that administrative operations are locked behind Passport.js JWT route guards.
- Point out the physical disk management (`fs.unlinkSync`): when an admin deletes a project image or replaces a thumbnail, the physical file is removed from `./uploads/` to prevent storage leaks.

---

### SLIDE 7: Project Outcomes (4/4) — Backend API, Swagger Docs & Dual SMTP Mailer

#### Primary Screenshot Options:
- **Option A (API Docs & Email - Recommended):** Open `http://localhost:3000/api/docs` (Swagger UI) or Postman showing the endpoint catalog, alongside a screenshot of an incoming email in your Gmail inbox or terminal dispatch logs.
- **Option B (Code):** Screenshot `contact.service.ts` showing the dual email dispatch and `app.module.ts` showing the infrastructure registration.

#### Code References:
1. **Contact Service Dual Email Dispatch:** [`backend/src/contact/contact.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.service.ts#L18-L43)  
   **Lines 18–43:**
   ```typescript
   // File Reference: backend/src/contact/contact.service.ts (Lines 18-43)
   async create(createContactDto: CreateContactDto): Promise<Contact> {
     const contact = this.contactRepository.create(createContactDto);
     const saved = await this.contactRepository.save(contact);
     this.logger.log(
       `New contact message from ${saved.name} (${saved.email}) saved to DB.`,
     );

     // 1. Send new inquiry notification to Studio/Admin (gusari2271@gmail.com)
     this.mailService
       .sendContactInquiryNotification(saved.name, saved.email, saved.message)
       .catch((err) =>
         this.logger.error('Failed to dispatch admin inquiry notification:', err),
       );

     // 2. Send automated confirmation receipt to prospective client
     this.mailService
       .sendContactFormConfirmation(saved.email, saved.message, saved.name)
       .catch((err) =>
         this.logger.error('Failed to dispatch sender confirmation:', err),
       );

     return saved;
   }
   ```

2. **Root Module Infrastructure:** [`backend/src/app.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/app.module.ts#L13-L36)  
   **Lines 13–36:**
   ```typescript
   // File Reference: backend/src/app.module.ts (Lines 13-36)
   @Module({
     imports: [
       ConfigModule.forRoot({ isGlobal: true }),
       ThrottlerModule.forRoot([
         {
           ttl: 60000,
           limit: 100,
         },
       ]),
       TypeOrmModule.forRoot({
         type: 'better-sqlite3',
         database: join(__dirname, '..', 'db.sqlite'),
         autoLoadEntities: true,
         synchronize: true,
       }),
       MailModule,
       AuditLogModule,
       AuthModule,
       AdminManagementModule,
       ProjectsModule,
       ContactModule,
     ],
   })
   export class AppModule {}
   ```

#### Key Examiner Talking Points:
- Show that inquiries trigger two separate emails: an administrative alert to `gusari2271@gmail.com` with `replyTo` pointing to the client's email, and an official confirmation receipt back to the sender.
- Highlight the rate limiting (`ThrottlerModule`: 100 req/60s) and global `ValidationPipe` protecting against spam and brute-force submissions.

---

### Step-by-Step Instructions to Insert Screenshots into PowerPoint

1. Open [`final_presentation_internship_v2_with_code_references.pptx`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/final_presentation_internship_v2_with_code_references.pptx) in PowerPoint.
2. Navigate to **Slides 4, 5, 6, and 7**.
3. In each slide, select the grey box labeled `[IMAGE / SCREENSHOT PLACEHOLDER]`.
4. Right-click and choose **Change Picture** (or simply press `Ctrl + V` after taking a screenshot using `Win + Shift + S`).
5. Resize the screenshot so it neatly covers the placeholder area above the "Screenshot Guide & Code Reference" text box.
6. Save your presentation (`Ctrl + S`). You are now 100% prepared for your final defense!
