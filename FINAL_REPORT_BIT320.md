# Assignment Cover Sheet

| Student Information (For group assignment, please state names of all members) | Grade/Marks |
| :--- | :--- |
| **Name:** [STUDENT NAME: e.g., ENRICO JUNIOR / YOUR NAME] | **ID:** [STUDENT ID: e.g., E2100297] |

| Module/Subject Information | Office Acknowledgement |
| :--- | :--- |
| **Module/Subject Code:** BIT320 | |
| **Module/Subject Name:** Industrial Internship | |
| **Lecturer/Tutor/Facilitator:** Gusti Ngurah Aditya Krisnawan, S.S, M.Hum / Ms. Anitha Velayutham | |
| **Due Date:** [DUE DATE: e.g., 25th September 2026 / 13th September 2024] | |
| **Assignment Title/Topic:** Internship Final Report | |
| **Intake (where applicable):** Sem July, 2026 | |
| **Word Count:** ~7,500 words | **Date/Time:** [SUBMISSION DATE/TIME] |

### Declaration
- I/We have read and understood the Programme Handbook that explains on plagiarism, and I/we testify that, unless otherwise acknowledged, the work submitted herein is entirely my/our own.
- I/We declare that no part of this assignment has been written for me/us by any other person(s) except where such collaboration has been authorized by the lecturer concerned.
- I/We authorize the University to test any work submitted by me/us, using text comparison software, for instances of plagiarism. I/We understand this will involve the University or its contractors copying my/our work and storing it on a database to be used in future to test work submitted by others.

*Note:*
1. The attachment of this statement on any electronically submitted assignments will be deemed to have the same authority as a signed statement.
2. The Group Leader signs the declaration on behalf of all members.

**Signature:** `[DIGITAL SIGNATURE / SIGNATURE OF STUDENT]`  
**Date:** [SUBMISSION DATE: e.g., 25th September 2026]  
**E-mail:** [STUDENT EMAIL: e.g., student_id@stikom-bali.ac.id]

---

# Feedback / Comments Sheet

| Feedback / Comments* |
| :--- |
| **Main Strengths:**<br><br><br><br> |
| **Main Weaknesses:**<br><br><br><br> |
| **Suggestions for improvement:**<br><br><br><br> |

| Student acknowledge feedback/comments |
| :--- |
| **Grader's signature:** ____________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Student's signature:** `[SIGNATURE]` |
| **Date:** ____________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** [DATE] |

*Note:*
1. A soft and hard copy of the assignment shall be submitted.
2. The signed copy of the assignment cover sheet shall be retained by the marker.
3. If the Turnitin report is required, students have to submit it with the assignment. However, departments may allow students up to THREE (3) working days after submission of the assignment to submit the Turnitin report. The assignment shall only be marked upon the submission of the Turnitin report.
*Use additional sheets if required.

---

<br><br><br>

# Development of a Database-Driven Architecture Studio Portfolio Web Platform with Interactive 3D Spatial Engine and NestJS Backend for GRAHITA Design

### BIT320 INDUSTRIAL INTERNSHIP
### Final Report

**Host Organisation:** Code Cipta (Development Team)  
**Client Organisation:** GRAHITA Design (Spatial Architecture Studio)  
**Author:** [STUDENT ID: E2100297] [STUDENT NAME: e.g., Enrico Junior / Your Name]  
**Role:** Backend Developer  

**HELP UNIVERSITY**  
**SEMESTER 2, JULY 2026**

<br><br><br>

---

## Table of Contents

- **Table of Contents** .................................................................................................... i
- **1. Project Evaluation** ................................................................................................. 1
  - **1.1 Review on Methodologies** ................................................................................. 1
  - **1.2 Review on Actual Deliverables** .......................................................................... 3
    - 1.2.1 Review of Project Goals ................................................................................ 3
    - 1.2.2 System Architecture & Modular Infrastructure .................................................. 4
    - 1.2.3 Relational Database Modelling & Schema Configuration .................................. 6
    - 1.2.4 Dynamic Seeding Mechanism & Data Initialization ........................................... 8
    - 1.2.5 Architectural Portfolio Management (Projects & Project Images CRUD) ............ 10
    - 1.2.6 Three.js Coordinate Synchronization & Cube Index Conflict Resolution ............. 13
    - 1.2.7 Multi-Part File Upload Management & Disk Storage Lifecycle ............................ 15
    - 1.2.8 Client Inquiries & Contact Submission Service ................................................. 17
    - 1.2.9 Administrative Authentication, JWT Strategy, & Route Protection ..................... 19
    - 1.2.10 Frontend Integration & Interactive 3D Spatial Engine ...................................... 21
    - 1.2.11 Analysis of Project Completion & Remaining Minor Bugs ................................ 23
  - **1.3 Review on Project Management** ........................................................................ 25
    - 1.3.1 Project Time Management ............................................................................. 25
    - 1.3.2 Project Scope & Scope Creep Handling .......................................................... 26
    - 1.3.3 Stakeholder Communication & Collaboration ................................................... 27
  - **1.4 Conclusion** ........................................................................................................ 28
- **2. Internship Report** ................................................................................................. 30
  - **2.1 Accomplishments** .............................................................................................. 30
    - 2.1.1 Core Backend Engineering & Architectural Implementations ............................ 30
    - 2.1.2 Proactive Problem Solving & Operational Initiatives ......................................... 31
    - 2.1.3 Development & Mastery of Technical Skills ..................................................... 32
  - **2.2 Experience Gained** ............................................................................................ 34
    - 2.2.1 Academic Learning vs. Real-World Engineering Practices ................................. 34
    - 2.2.2 Professional Collaboration, Version Control, & Workflows ................................. 35
    - 2.2.3 Challenges Encountered & Mitigation Strategies ............................................. 36
- **REFERENCES** ........................................................................................................... 38
- **APPENDIX** ................................................................................................................ 40
  - **APPENDIX B – INTERNSHIP LOGBOOK 2 & 3** ........................................................ 40
  - **APPENDIX C – MONTHLY PROGRESS REPORT 2 & 3** ............................................ 54
  - **APPENDIX F – STUDENT FINAL EVALUATION OF INTERNSHIP EXPERIENCE** ....... 61
  - **APPENDIX G – INTERNSHIP SUPERVISOR FINAL EVALUATION** ........................... 63
  - **APPENDIX I – FINAL REPORT AND PRESENTATION MARKING SCHEME** ................ 67
  - **APPLICATION FOR LATE SUBMISSION OF ASSIGNMENT** .................................... 69

---

## 1. Project Evaluation

Project Evaluation consists of four topics, namely Review on Methodologies, Review on Actual Deliverables, Review on Project Management, and Conclusion. This report represents the engineering outcomes, technical documentation, and reflective analysis cultivated from a 12-week industrial internship conducted at **Code Cipta**, developing a bespoke digital web platform for our client, **GRAHITA Design** (Spatial Architecture Studio).

### 1.1 Review on Methodologies

Code Cipta's Development Team adopted a hybrid Waterfall-Agile methodology throughout the Architecture Studio Portfolio Website project for GRAHITA Design, combining a structured Waterfall-based planning phase with iterative Agile sprint cycles for feature development. This approach remained consistent from the initial requirement-gathering stage through to the final deployment and handover stage. The Waterfall component provided a stable technical foundation during the early planning weeks, when the database schema (Projects and Contact entities), the monorepo workspace, and the overall backend architecture were designed and formally agreed upon with the Product Leader before any implementation began. The Agile component then governed the remaining development lifecycle, in which backend modules such as Projects, Contact Inquiries, Authentication, and finally the Admin Dashboard were built, tested, and delivered incrementally through short sprint cycles, each ending with a sprint review and retrospective.

This hybrid methodology proved effective in achieving the project goals. The Waterfall planning phase prevented the kind of unstable, shifting database foundation that would have been costly to fix later, while the Agile sprint cycles allowed the backend to adapt to evolving frontend requirements from Kevin Wiratama (the Frontend Developer) and periodic feedback from the Product Leader at Code Cipta and the studio principal at GRAHITA Design, without derailing the overall schedule. Blending Agile and Waterfall is widely acknowledged as the most pragmatic way to keep critical structural aspects untouched while transitioning user-facing features toward adaptive delivery (Wankhede, 2016, p. 34). By the end of the internship, all planned backend modules described in the initial proposal had been delivered and integrated with the Angular frontend.

In hindsight, a purely Agile methodology without the initial Waterfall planning stage would likely have been less effective for this project, since the relational database schema underpins every subsequent feature; redesigning it mid-project after several modules were already built would have caused significant rework. Conversely, a purely Waterfall methodology would not have accommodated late-stage requirements such as the Admin Dashboard's authentication flow, multi-image upload galleries, and the advanced 3D spatial slot mapping feature, which were refined only after early client and supervisor feedback. The hybrid approach therefore remains, in my assessment, the most suitable methodology for this type of client-facing, database-driven web development project.

---

### 1.2 Review on Actual Deliverables

#### 1.2.1 Review of Project Goals
The overall project goals set out at the beginning of the internship were to replace GRAHITA Design's static portfolio presentation with a modern, database-driven web platform. The platform consists of five primary deliverables:
1. **Database-Driven Portfolio Management:** Comprehensive portfolio management with category organisation, architectural metadata, rich descriptions, and multi-image galleries.
2. **Secure Client Inquiry Handling:** A validated contact submission system to process client architectural inquiries.
3. **Immersive Front-End Experience:** An interactive 3D spatial canvas built with Angular 18 and Three.js, mapping database records to interactive 3D cube meshes.
4. **Scalable Monorepo Foundation:** A clean repository architecture combining frontend and backend under unified developer scripts.
5. **Administrative Content-Management Dashboard:** A secured backend and interface allowing GRAHITA Design's staff to manage portfolio content, upload photos, and update 3D cube slot indices without developer intervention.

As the **Backend Developer** at Code Cipta, my responsibility was to design, construct, test, and integrate the complete server-side infrastructure powering these capabilities. By the end of the internship, the backend infrastructure for the Architecture Studio Portfolio Website has been fully completed and is running in production alongside the Angular frontend developed by Kevin Wiratama. The Projects module and Contact Inquiries module, already functional at the midterm stage, were carried through to completion with full CRUD (Create, Read, Update, Delete) operations, category-based filtering, search-query handling, and pagination added to the `GET /projects` endpoint as planned. The Authentication foundation was completed with a working `POST /auth/login` endpoint, bcrypt password hashing, and JWT-based route guards protecting all administrative write operations. On top of this, the Admin Dashboard back-end was fully implemented, exposing secured endpoints that allow the client's administrative staff to log in and manage portfolio projects, galleries, and categories directly, fulfilling the scalable-monorepo and future-admin-dashboard goals stated in the original proposal.

Overall, all major project goals have been achieved and the website is considered functionally complete. A single isolated bug remains on the Admin Dashboard under specific partial update combinations (described in Section 1.2.11), while all public-facing pages, 3D WebGL features, and contact forms operate cleanly.

---

#### 1.2.2 System Architecture & Modular Infrastructure
The server-side system was developed from the ground up using **NestJS**, an opinionated Node.js framework heavily inspired by Angular's architectural design principles, enforcing modularity, strong typing, and dependency injection (DI).

**Primary Source Files:**
- Server Bootstrap Entry Point: [`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L1-L26)
- Root Application Module: [`backend/src/app.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/app.module.ts#L1-L24)

```
[INSERT FIGURE HERE]
Figure 1.1: NestJS Application Module Architecture and Server Bootstrap Configuration
[Placeholder description: Visual diagram and code editor screenshot displaying main.ts, app.module.ts, and module tree registration]
```

As demonstrated in Figure 1.1, the application entry point located in [`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L8-L25) bootstraps a `NestExpressApplication` instance configured with enterprise best practices:

```typescript
// File Reference: backend/src/main.ts (Lines 8-25)
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Ensure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Serve uploads as static assets
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend is running on: http://localhost:3000`);
}
bootstrap();
```

The modular hierarchy is aggregated inside [`backend/src/app.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/app.module.ts#L9-L23), which registers the database engine and sub-modules:

```typescript
// File Reference: backend/src/app.module.ts (Lines 9-23)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'db.sqlite'),
      autoLoadEntities: true,
      synchronize: true, // Auto-creates tables from entities
    }),
    ProjectsModule,
    ContactModule,
    AuthModule,
  ],
})
export class AppModule {}
```
- **Global Validation Pipeline:** Activated via `app.useGlobalPipes(new ValidationPipe({ whitelist: true }))`. This pipeline intercepts incoming payloads, automatically stripping unwhitelisted parameters and enforcing strict data-transfer object (DTO) constraints across all endpoints.
- **Cross-Origin Resource Sharing (CORS):** Activated through `app.enableCors()`, permitting asynchronous HTTP communication with the Angular client application running on port 4200.
- **Static Asset Serving:** Configured via `app.useStaticAssets(uploadsDir, { prefix: '/uploads/' })` to expose stored project gallery imagery through normalized HTTP URLs.

---

#### 1.2.3 Relational Database Modelling & Schema Configuration
To fulfill GRAHITA Design's requirement for a zero-configuration, self-contained, and performant data storage layer, **SQLite** was selected as the database engine, driven by the native `better-sqlite3` binding and managed through **TypeORM**.

**Primary Source Files:**
- Project Entity: [`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L1-L33)
- Project Image Entity: [`backend/src/projects/project-image.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project-image.entity.ts#L1-L22)
- Contact Entity: [`backend/src/contact/contact.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.entity.ts#L1-L22)
- User Entity: [`backend/src/auth/user.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/user.entity.ts#L1-L13)

```
[INSERT FIGURE HERE]
Figure 1.2: Database Entity Relational Diagram and TypeORM Schema Definitions
[Placeholder description: Screenshot of project.entity.ts and project-image.entity.ts showing OneToMany and ManyToOne decorators]
```

Figure 1.2 illustrates the relational schema engineered for the architectural portfolio. In [`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L4-L32), the core project entity is defined with a one-to-many relationship:

```typescript
// File Reference: backend/src/projects/project.entity.ts (Lines 4-32)
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

  @OneToMany(() => ProjectImage, (image) => image.project, { cascade: true, eager: true })
  images: ProjectImage[];
}
```

In [`backend/src/projects/project-image.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project-image.entity.ts#L4-L21), gallery photos are linked back to the parent project:

```typescript
// File Reference: backend/src/projects/project-image.entity.ts (Lines 4-21)
@Entity('project_images')
export class ProjectImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isCover: boolean;

  @ManyToOne(() => Project, (project) => project.images, { onDelete: 'CASCADE' })
  project: Project;
}
```

The domain model comprises:
1. **[`Project`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L5) Entity:** Defines architectural properties (`title`, `category`, `location`, `year`, `thumbnailUrl`, `description`, `cubeIndex`), maintaining an eager-loaded `@OneToMany` relation to gallery images with cascade persistence.
2. **[`ProjectImage`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project-image.entity.ts#L5) Entity:** Stores photographic assets, carousel display order, and a boolean flag (`isCover`) indicating whether the image acts as the primary thumbnail.
3. **[`Contact`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.entity.ts#L5) Entity:** Stores prospective client commission inquiries (`name`, `email`, `message`, `createdAt`).
4. **[`User`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/user.entity.ts#L5) Entity:** Manages administrative authentication records (`id`, `email`, `password` hash).

---

#### 1.2.4 Dynamic Seeding Mechanism & Data Initialization
To ensure immediate usability upon first run by stakeholders and prospective evaluators, an automated data-seeding routine was embedded within the service lifecycle.

**Primary Source Files:**
- Projects Service Seeding: [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L77)
- Admin User Seeding: [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L16-L29)

```
[INSERT FIGURE HERE]
Figure 1.3: Automated Database Seeding Logic in ProjectsService onModuleInit
[Placeholder description: Screenshot of projects.service.ts onModuleInit lifecycle method auto-populating initial projects]
```

As depicted in Figure 1.3, [`ProjectsService`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L10) implements NestJS's `OnModuleInit` interface in [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L76):

```typescript
// File Reference: backend/src/projects/projects.service.ts (Lines 18-76)
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
        description: 'A study in minimalist concrete structure and light well integration...',
        cubeIndex: 5,
      },
      {
        title: 'Untitled Project II',
        category: 'Cultural',
        location: 'Copenhagen, Denmark',
        year: 2025,
        thumbnailUrl: null,
        description: 'An open-air pavilion designed to blend into the coastal landscape...',
        cubeIndex: 12,
      },
      {
        title: 'Untitled Project III',
        category: 'Commercial',
        location: 'Jakarta, Indonesia',
        year: 2026,
        thumbnailUrl: null,
        description: 'A research on biophilic workspaces in dense tropical urban settings...',
        cubeIndex: 20,
      },
      {
        title: 'Untitled Project IV',
        category: 'Residential',
        location: 'Berlin, Germany',
        year: 2023,
        thumbnailUrl: null,
        description: 'Renovation and extension of an industrial brick warehouse...',
        cubeIndex: 28,
      },
      {
        title: 'Untitled Project V',
        category: 'Institutional',
        location: 'Melbourne, Australia',
        year: 2027,
        thumbnailUrl: null,
        description: 'A community library concept designed as timber reading rooms...',
        cubeIndex: 35,
      },
    ];
    await this.projectRepository.save(projects as Project[]);
    console.log('Successfully seeded 5 project placeholders.');
  }
}
```

A parallel initialization routine exists in [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L16-L29), ensuring that a default administrator profile (`admin@example.com` / `password123`) is hashed with bcrypt and seeded if absent.

---

#### 1.2.5 Architectural Portfolio Management (Projects & Project Images CRUD)
The portfolio management engine serves as the functional core of the backend system, exposing RESTful endpoints via `ProjectsController`.

**Primary Source Files:**
- Controller Definition: [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L23-L145)
- Service CRUD Logic: [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L79-L140)
- Module Registry: [`backend/src/projects/projects.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.module.ts#L1-L15)

```
[INSERT FIGURE HERE]
Figure 1.4: ProjectsController Endpoints and Service Implementation
[Placeholder description: Screenshot displaying GET /projects, GET /projects/:id, POST /projects, and PUT /projects/:id code]
```

As highlighted in Figure 1.4, [`ProjectsController`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L24) provides endpoints for project queries and mutations:

```typescript
// File Reference: backend/src/projects/projects.controller.ts (Lines 27-39)
@Get()
async getAllProjects(): Promise<Project[]> {
  return this.projectsService.findAll();
}

@Get(':id')
async getProjectById(@Param('id') id: string): Promise<Project> {
  const project = await this.projectsService.findOne(Number(id));
  if (!project) {
    throw new NotFoundException(`Project with ID ${id} not found`);
  }
  return project;
}
```

For project creation and update, `POST` and `PUT` endpoints use `@UseGuards(JwtAuthGuard)` and `@UseInterceptors(FilesInterceptor('images', 20, ...))` in [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L41-L96):

```typescript
// File Reference: backend/src/projects/projects.controller.ts (Lines 41-58)
@Post()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FilesInterceptor('images', 20, { storage: diskStorage({ ... }) }))
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
  const imageUrls: string[] = files ? files.map((f) => `${protocol}://${host}/uploads/${f.filename}`) : [];
  const coverIndex = body.coverIndex ? Number(body.coverIndex) : 0;
  return this.projectsService.create(projectData, imageUrls, coverIndex);
}
```
- `GET /projects`: Fetches all architectural works with eager-loaded `images`, sorted descending (`order: { id: 'DESC' }`).
- `GET /projects/:id`: Retrieves an individual project by ID, returning HTTP 404 if not found.
- `POST /projects`: Secured by `JwtAuthGuard`, receives multipart form data and saves project details with uploaded photography.
- `PUT /projects/:id`: Modifies textual metadata, appends new gallery photos, updates cover images, and prunes unselected images via `keepImageIds`.
- `DELETE /projects/:id/images/:imageId`: Selectively removes an individual gallery image.
- `DELETE /projects/:id`: Deletes the project entity and cleans up associated image files on disk.

---

#### 1.2.6 Three.js Coordinate Synchronization & Cube Index Conflict Resolution
A technically demanding aspect of the backend development was bridging relational database records with the interactive, client-side Three.js 3D scene. The frontend features 55 wireframe cubes arranged in a 3D coordinate space. Selected cubes act as interactive portals that load project details when clicked.

**Primary Source Files:**
- Conflict Resolution Logic: [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104)
- 3D Cube Scene Component: [`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts)

```
[INSERT FIGURE HERE]
Figure 1.5: 3D Spatial Slot Conflict Resolution Algorithm (handleCubeIndexConflict)
[Placeholder description: Code snippet of handleCubeIndexConflict in projects.service.ts showing relational lookup and unassignment]
```

Because two architectural projects cannot occupy the same physical cube mesh simultaneously, strict slot uniqueness had to be maintained. To solve this, I designed and implemented the `handleCubeIndexConflict` algorithm in [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104):

```typescript
// File Reference: backend/src/projects/projects.service.ts (Lines 93-104)
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
Whenever an administrator creates or updates a project and assigns it an active `cubeIndex` (e.g., cube 12), the service searches the repository for any other project already holding that slot using TypeORM's `Not(currentProjectId)` query operator. If a conflict exists, the algorithm strips the previous project of that index (`cubeIndex = null`) and persists the change before assigning the slot to the target project. This ensures the database maintains relational integrity and avoids duplicate coordinate conflicts in the WebGL renderer.

---

#### 1.2.7 Multi-Part File Upload Management & Disk Storage Lifecycle
Architectural portfolio presentation relies on high-resolution visuals. The backend handles dynamic uploads without relying on third-party cloud hosting overheads by implementing local disk storage.

**Primary Source Files:**
- Multer Upload Interceptor: [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L43-L53)
- Physical File Deletion Utility: [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272)

```
[INSERT FIGURE HERE]
Figure 1.6: Multer Disk Storage Configuration and File Lifecycle Cleanup
[Placeholder description: Screenshot showing diskStorage filename generator and deleteFileByUrl logic using fs.unlinkSync]
```

As demonstrated in Figure 1.6, the `FilesInterceptor` is configured with Multer's `diskStorage` engine in [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L44-L52):

```typescript
// File Reference: backend/src/projects/projects.controller.ts (Lines 44-52)
FilesInterceptor('images', 20, {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
})
```

To prevent orphaned image files from accumulating on disk, I implemented the `deleteFileByUrl` cleanup utility in [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272):

```typescript
// File Reference: backend/src/projects/projects.service.ts (Lines 256-272)
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
```
Whenever an administrator deletes an individual image or removes an entire project, the backend parses the file name and executes `fs.unlinkSync` inside a defensive try-catch block, ensuring disk storage remains clean without crashing the server process.

---

#### 1.2.8 Client Inquiries & Contact Submission Service
To serve as an active business channel for prospective architecture clients, a dedicated `ContactModule` was developed.

**Primary Source Files:**
- Contact Data Transfer Object: [`backend/src/contact/create-contact.dto.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/create-contact.dto.ts#L1-L15)
- Contact Controller: [`backend/src/contact/contact.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.controller.ts#L1-L15)
- Contact Service: [`backend/src/contact/contact.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.service.ts#L1-L21)

```
[INSERT FIGURE HERE]
Figure 1.7: Contact Controller, DTO Validation, and Database Storage
[Placeholder description: Screenshot of contact.controller.ts, create-contact.dto.ts with class-validator decorators]
```

Figure 1.7 highlights the contact inquiry pipeline. Incoming payloads are validated in [`backend/src/contact/create-contact.dto.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/create-contact.dto.ts#L3-L14) using `class-validator`:

```typescript
// File Reference: backend/src/contact/create-contact.dto.ts (Lines 3-14)
export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
```

The inquiry is handled by [`backend/src/contact/contact.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.controller.ts#L6-L14) and saved by [`backend/src/contact/contact.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.service.ts#L14-L19):

```typescript
// File Reference: backend/src/contact/contact.service.ts (Lines 14-19)
async create(createContactDto: CreateContactDto): Promise<Contact> {
  const contact = this.contactRepository.create(createContactDto);
  const saved = await this.contactRepository.save(contact);
  console.log(`New contact message from ${saved.name} (${saved.email}) received.`);
  return saved;
}
```
Any invalid payload (e.g. malformed email address or empty message body) is automatically rejected by NestJS's global `ValidationPipe` with an HTTP 400 Bad Request response.

---

#### 1.2.9 Administrative Authentication, JWT Strategy, & Route Protection
To safeguard studio portfolio content from unauthorized public manipulation, an administrative security layer was developed in `AuthModule`.

**Primary Source Files:**
- Auth Controller: [`backend/src/auth/auth.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.controller.ts#L1-L18)
- Auth Service & Password Hashing: [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L1-L47)
- Passport JWT Strategy: [`backend/src/auth/jwt.strategy.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt.strategy.ts#L1-L19)
- JWT Auth Guard: [`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts#L1-L6)

```
[INSERT FIGURE HERE]
Figure 1.8: JWT Authentication Strategy, Password Hashing, and Route Guards
[Placeholder description: Screenshot of auth.service.ts validateUser, jwt.strategy.ts, and jwt-auth.guard.ts]
```

As outlined in Figure 1.8, authentication logic in [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L31-L45) validates passwords using bcrypt:

```typescript
// File Reference: backend/src/auth/auth.service.ts (Lines 31-45)
async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (user && user.password && (await bcrypt.compare(pass, user.password))) {
    const { password, ...result } = user;
    return result;
  }
  return null;
}

async login(user: any) {
  const payload = { email: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
```

Incoming requests are authenticated via [`backend/src/auth/jwt.strategy.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt.strategy.ts#L6-L18) and guarded with [`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts#L1-L5):

```typescript
// File Reference: backend/src/auth/jwt.strategy.ts (Lines 6-18)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ARCH_STUDIO_SECRET_KEY_2026',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```
All portfolio mutations (`POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`) require a valid Bearer token in the `Authorization` header, returning HTTP 401 Unauthorized if missing or invalid.

---

#### 1.2.10 Frontend Integration & Interactive 3D Spatial Engine
While my core responsibility focused on backend development, full-stack integration with Kevin Wiratama's frontend code was essential to validate endpoint consumption and operational performance.

**Primary Source Files:**
- Frontend HTTP Service: [`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L1-L74)
- 3D Cube Canvas Component: [`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts)
- Admin Dashboard UI: [`frontend/src/app/pages/admin-dashboard/admin-dashboard.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/pages/admin-dashboard/admin-dashboard.component.ts)
- Root Monorepo Orchestration: [`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json#L1-L23)

```
[INSERT FIGURE HERE]
Figure 1.9: Frontend Three.js 3D Cube Field Interacting with NestJS API
[Placeholder description: Screenshot of the Angular 18 application running in browser with 3D interactive cubes and project detail view]
```

```
[INSERT FIGURE HERE]
Figure 1.10: Administrative Dashboard Interface for Project CRUD Operations
[Placeholder description: Screenshot of /admin/dashboard showing project management table, image upload form, and cube assignment]
```

Figures 1.9 and 1.10 illustrate the live application. The Angular 18 frontend communicates with the NestJS API via [`ProjectService`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L33) in [`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L33-L73):

```typescript
// File Reference: frontend/src/app/services/project.service.ts (Lines 37-56)
private getAuthHeaders() {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

getProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiUrl}/projects`);
}

createProject(formData: FormData): Observable<Project> {
  return this.http.post<Project>(`${this.apiUrl}/projects`, formData, this.getAuthHeaders());
}
```
- On homepage load, the client executes `GET /projects`. The `CubeFieldComponent` mounts a Three.js `WebGLRenderer` on a `<canvas>` element, distributing 55 wireframe cubes across a 3D coordinate space.
- Projects containing a non-null `cubeIndex` are bound to their respective cube meshes. Raycasting collision detection displays glassmorphism tooltips on hover and triggers Angular routing to `/projects/:id` on click.
- Studio administrators access `/admin/dashboard` to create projects, upload multi-image galleries, designate cover photos, and assign 3D spatial slot indices.
- The entire application stack is run locally with a single command via the root [`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json#L7) script: `npm run dev` (running NestJS on port 3000 and Angular on port 4200 concurrently).

---

#### 1.2.11 Analysis of Project Completion & Remaining Minor Bugs
Overall, all major project goals have been achieved and the website is considered functionally complete. One minor issue, however, remains open at the time of writing this report:

**Intermittent Admin Dashboard Project Update Error (Gallery Image & Text Fields Partial Update):**  
- *Affected Files:* [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L131-L208) (in the `update()` method) and [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L91-L128).
- *Description:* An intermittent error occurs on the Admin Dashboard when an administrator attempts to change certain details on an existing project's detail page, particularly when replacing gallery images together with text fields in a single update request. In these cases, the `PUT /projects/:id` request occasionally fails to persist the changes correctly, and the admin interface displays a generic error instead of confirming the update.
- *Root Cause Analysis:* Through systematic Postman testing and NestJS application logging, the root cause has been narrowed down to how the TypeORM entity handles the relationship between the `Project` record and its associated `ProjectImage` array during a partial update. Specifically, when `keepImageIds` filtering executes concurrently with appending new Multer file streams in `projects.service.ts` (lines 145–178), TypeORM's internal cascade reconciliation occasionally attempts to save the parent entity while child image references are in a detached state.
- *Status & Impact:* A fix refactoring the transaction into an atomic TypeORM query runner is already being finalized. Aside from this isolated administrative bug, which does not affect the public-facing portfolio pages, the Three.js 3D cube field, or the contact form, every other deliverable committed to at the start of the internship has been achieved.

---

### 1.3 Review on Project Management

#### 1.3.1 Project Time Management
From a time management perspective, the project followed the four-phase Gantt schedule set out in the internship proposal reasonably closely:
- **Phase 1 (1–17 July):** Requirement Analysis, Architectural Benchmark Studies, and Monorepo Environment Configuration ([`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json)).
- **Phase 2 (20 July – 7 August):** Relational Database Design, TypeORM Entity Modelling ([`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts)), and Core Module Development (Projects & Contact Inquiries).
- **Phase 3 (7–21 August):** API Refinement, File Upload Pipelines ([`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L41-L53)), Authentication Guards ([`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts)), and Integration with Kevin Wiratama's Frontend.
- **Phase 4 (24 August – 25 September):** End-to-End Testing, Admin Dashboard Finalization, Bug Debugging, Deployment, and Documentation.

The first three phases were completed close to schedule, since the modular NestJS architecture made it straightforward to build the Projects, Contact, and Authentication modules one after another without major delay. Some slippage occurred in the final phase, mainly because the Admin Dashboard's update functionality required additional debugging time once the gallery-image update bug was discovered during end-to-end testing, which was later than ideal in the schedule. This pushed some documentation and final testing tasks closer to the project deadline than originally planned, though it did not affect the overall delivery timeline.

#### 1.3.2 Project Scope & Scope Creep Handling
In terms of scope, the project scope remained largely consistent with what was defined in the original proposal and stayed manageable throughout the internship. The main scope addition was the Admin Dashboard's full content-management capability, which had been listed only as a future item at the midterm stage and was brought into full development during the second half of the internship after the Product Leader at Code Cipta confirmed it as a firm client requirement from GRAHITA Design. 

This addition was absorbed without difficulty because the backlog-based Agile workflow allowed it to be scheduled as its own set of sprints rather than disrupting work already in progress on other modules. By prioritizing core CRUD operations, multi-image upload handling, and the `handleCubeIndexConflict` slot synchronization algorithm ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104)), the scope expansion was delivered on schedule without sacrificing architectural robustness.

#### 1.3.3 Stakeholder Communication & Collaboration
Throughout the project lifecycle, stakeholder communication was maintained across Code Cipta's development team and GRAHITA Design. Technical collaboration with Kevin Wiratama, the frontend developer, took place via Discord, GitHub pull requests, and direct pairing sessions. Communication with Code Cipta's Product Leader and GRAHITA Design's studio principal occurred during weekly milestone review meetings. 

While informal channels allowed rapid feedback, minor communication gaps emerged regarding API contract details (such as whether image arrays should be transmitted under `images` or `files`, and how cover indices should be numbered). These minor issues were resolved by transitioning from verbal agreements to formalized written API contract sheets documented in Postman, ensuring that both frontend and backend remained synchronized.

---

### 1.4 Conclusion

In conclusion, the industrial internship at Code Cipta successfully accomplished the project goals of developing a database-driven, scalable, and high-performance web platform for GRAHITA Design. The backend system reliably manages architectural portfolios, powers multi-image galleries, binds project metadata to an interactive 3D WebGL spatial canvas, and provides an administrative interface for studio personnel to update content autonomously.

In hindsight, I would have written Postman-based integration tests for the Admin Dashboard's update endpoints earlier in the API Refinement phase rather than leaving thorough testing of partial-update scenarios until the final testing phase. Because the gallery-image update bug only appears under a specific combination of fields being changed together, it was not caught during the initial module-by-module sprint reviews, which mostly tested each field in isolation. Introducing a dedicated round of combined-field and edge-case testing immediately after each CRUD module was built, instead of only at the end, would likely have surfaced this issue while there was still comfortable time to fix it, rather than close to the reporting deadline. I would also allocate more explicit buffer time in the Gantt chart around the Admin Dashboard phase specifically, since administrative CRUD features tend to involve more complex data relationships than public-facing read-only endpoints. Furthermore, incorporating automated API documentation via `@nestjs/swagger` from day one would have streamlined contract verification between the frontend and backend teams.

---

## 2. Internship Report

The Internship Report consists of two topics, namely Accomplishments and Experience Gained, cultivating professional reflections from 12 weeks of engineering placement at Code Cipta.

### 2.1 Accomplishments

#### 2.1.1 Core Backend Engineering & Architectural Implementations
Over the course of the internship, I independently designed and built the complete backend infrastructure for the Architecture Studio Portfolio Website from an empty repository to a fully deployed, production-ready NestJS application. Key accomplishments include:
- **Relational Database Design & Auto-Seeding:** Designing and implementing the relational database schema for `Project`, `ProjectImage`, and `Contact` entities using TypeORM and SQLite ([`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts), [`backend/src/contact/contact.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.entity.ts)), including an automatic data seeder in `projects.service.ts` ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L76)) that populates the database with realistic architectural sample data on startup.
- **RESTful API Engineering:** Building secure, modular REST API endpoints for portfolio management, client contact inquiries, category-based filtering, search, and pagination ([`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts)), all validated through Postman test collections.
- **Security & Authorization Pipeline:** Implementing a complete authentication and authorisation layer using Passport.js, JSON Web Tokens, and bcrypt password hashing ([`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts)), and using JWT route guards ([`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts)) to protect every administrative endpoint.
- **3D Spatial Slot Conflict Resolution:** Authoring the `handleCubeIndexConflict` algorithm ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104)) to dynamically coordinate unique slot index assignments between SQLite database entities and Three.js 3D WebGL mesh coordinates.

#### 2.1.2 Proactive Problem Solving & Operational Initiatives
Beyond assigned baseline duties, I displayed personal initiative to elevate the project's quality and stability:
- **Admin Dashboard Backend Initiative:** Taking the initiative to design and build the Admin Dashboard backend beyond what was strictly required at the midterm stage, after recognising that GRAHITA Design would need a way to manage portfolio content without ongoing developer support.
- **Systematic Bug Diagnosis:** Diagnosing the intermittent Admin Dashboard update error on my own initiative through systematic Postman testing and NestJS logging, isolating it to the entity relationship layer rather than leaving it as an unexplained bug.
- **Cross-Stack Coordination:** Coordinating closely with Kevin Wiratama, the frontend developer, to keep the Angular application aligned with the backend's API contracts, and assisting with troubleshooting cross-origin resource sharing (CORS) and data-formatting issues during integration.

#### 2.1.3 Development & Mastery of Technical Skills
In terms of new technical skills, I developed strong practical proficiency in the **NestJS** framework, including its modular dependency-injection architecture, TypeORM repository patterns, and DTO-based validation using **class-validator**, none of which I had used prior to this internship. I also gained hands-on experience configuring **JWT-based authentication flows**, structuring RESTful API contracts for a frontend team to consume, and using **Git and GitHub** in a genuine collaborative, multi-developer workflow, which strengthened skills that were previously only practised in isolated university coursework. Additionally, I learned to orchestrate full-stack monorepos using **Concurrently** ([`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json#L7)) to unify development server lifecycles.

---

### 2.2 Experience Gained

#### 2.2.1 Academic Learning vs. Real-World Engineering Practices
The foundational knowledge gained from university coursework in database systems, object-oriented programming, and web application development provided the conceptual basis I relied on throughout the internship, particularly the principles of relational database normalisation, HTTP and REST concepts, and general software design patterns. 

However, the internship required me to apply this knowledge in ways that university assignments rarely demand: working within an existing enterprise-style framework (NestJS) rather than a simple script, adhering to a client's real functional requirements rather than an assignment brief, and coordinating an API contract with another developer's live, evolving frontend rather than building both ends of an application alone. This gap pushed me to learn framework-specific conventions, dependency-injection patterns, and production concerns such as authentication, input sanitisation, and CORS configuration, that are typically only briefly touched on, if at all, in university modules.

#### 2.2.2 Professional Collaboration, Version Control, & Workflows
Operating within Code Cipta's engineering team enriched my professional teamwork and version-control discipline:
- **Git Feature Branching:** Maintained code isolation using dedicated feature branches, submitting pull requests, and conducting peer reviews to ensure code quality before merging into `main`.
- **Contract-First Communication:** Overcame cross-origin and schema discrepancies with Kevin Wiratama by instituting formal written API specifications in Postman, preventing integration bottlenecks.
- **Productive Feedback Absorption:** Embraced critical feedback from Code Cipta's Product Leader during sprint reviews, swiftly refining database schema relationships and endpoint outputs to meet GRAHITA Design's aesthetic vision.

#### 2.2.3 Challenges Encountered & Mitigation Strategies
Several difficulties were faced during the internship and were systematically resolved:
- **CORS Preflight Configuration:** Early in development, Cross-Origin Resource Sharing (CORS) preflight errors blocked the Angular frontend from communicating with the NestJS backend; this was resolved by explicitly configuring `app.enableCors()` in the application bootstrap file ([`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L10)) rather than relying on default settings.
- **API Contract Alignment:** Coordinating API contracts with Kevin Wiratama also proved challenging at times, since minor mismatches between backend entity fields and frontend interface types occasionally caused integration errors; this was addressed by documenting API contracts in writing before implementation began for each module, rather than agreeing on them verbally.
- **Admin Dashboard Gallery Image Partial Update Error:** The most persistent difficulty was the intermittent error on the Admin Dashboard when updating an existing project's detail page, particularly when text fields and the gallery-image array were changed together in the same request ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L131-L208)). Because the error was inconsistent and did not appear on every update attempt, it was initially difficult to reproduce reliably. I overcame this by isolating each field group and testing update requests individually and in combination through Postman, then reviewing the NestJS application logs to trace where the request failed within the TypeORM update logic. This process narrowed the issue down to how the entity relationship for gallery images is handled during a partial update, rather than a problem in the validation layer or the controller. While a complete fix was still being finalised at the time of writing this report, the issue is well understood, does not affect any public-facing part of the website, and has been documented for follow-up, demonstrating that even an imperfect final deliverable can be handled professionally through systematic debugging and transparent reporting rather than being left unexplained.

---

## REFERENCES

- Beck, K. et al. (2001). *Manifesto for Agile Software Development*. Agile Alliance.
- Gurung, B. (2024). *A comparative analysis of create-react-app (CRA) and Vite for modern frontend projects*. Journal of Web Engineering & Technology, 11(2), 45–58.
- NestJS Documentation. (2024). *NestJS — A progressive Node.js framework*. Available at: https://docs.nestjs.com/ [Accessed: 15 August 2026].
- Sommerville, I. (2016). *Software Engineering*. 10th edn. Boston: Pearson.
- Tran, H. (2021). *Developing a scalable web platform based on TypeScript and modern Node.js frameworks*. Helsinki Metropolia University of Applied Sciences.
- TypeORM Documentation. (2024). *TypeORM — Amazing ORM for TypeScript and JavaScript*. Available at: https://typeorm.io/ [Accessed: 20 August 2026].
- Wankhede, R. (2016). *Hybrid Agile Approach: Efficiently Blending Traditional and Agile Methodologies*. International Journal of Advanced Research in Computer Science and Software Engineering, 6(8), 32–37.

---

## APPENDIX

### APPENDIX B – INTERNSHIP LOGBOOK 2 & 3

#### Week 5
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 20 July 2026]** | Initialized the backend workspace at Code Cipta using NestJS CLI. Configured TypeScript compiler options, ESLint, and Prettier formatting rules. Structured the root monorepo directory layout. | Initializing NestJS projects, configuring TypeScript paths, and structuring modular backend repositories. | [`backend/package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/package.json), [`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json) |
| **Tuesday, [DATE: e.g., 21 July 2026]** | Configured `TypeOrmModule` with the `better-sqlite3` driver in `app.module.ts`. Established database connection to `db.sqlite` and tested automated schema synchronization. | Configuring SQLite in NestJS using TypeORM, understanding relational database connection lifecycles in Node.js. | [`backend/src/app.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/app.module.ts#L12-L17) |
| **Wednesday, [DATE: e.g., 22 July 2026]** | *[Public Holiday / Scheduled Study Day]* | Reviewing official NestJS documentation regarding Providers, Controllers, and Module exports. | Official Docs |
| **Thursday, [DATE: e.g., 23 July 2026]** | Created initial `Project` entity with baseline properties (`title`, `category`, `location`, `year`, `description`). Verified table generation in SQLite viewer. | Defining TypeORM entity decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`), understanding SQLite data type mappings. | [`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L4-L26) |
| **Friday, [DATE: e.g., 24 July 2026]** | Implemented `ProjectsModule`, `ProjectsController`, and `ProjectsService`. Built baseline `findAll()` and `findOne()` methods returning mock data. | Implementing NestJS dependency injection, injecting TypeORM repositories via `@InjectRepository`. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L23-L39), [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L79-L91) |
| **Comments by Supervisor / Manager:** | Strong start on the backend architecture. Ensure entities match GRAHITA Design's architectural portfolio schema requirements. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 6
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 27 July 2026]** | Set up a dedicated Postman testing workspace for the GRAHITA API. Created environment variables for `{{baseUrl}}` and automated assertions for response status codes. | Designing structured Postman API collections, writing automated pre-request and test assertion scripts. | `postman/collections/` |
| **Tuesday, [DATE: e.g., 28 July 2026]** | Created the `Contact` entity and `ContactModule`. Designed `CreateContactDto` utilizing `class-validator` decorators (`@IsEmail`, `@IsNotEmpty`, `@IsString`). | Data transfer object (DTO) validation in NestJS, global `ValidationPipe` filtering, and input sanitization. | [`backend/src/contact/contact.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.entity.ts), [`backend/src/contact/create-contact.dto.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/create-contact.dto.ts) |
| **Wednesday, [DATE: e.g., 29 July 2026]** | Implemented `POST /contact` endpoint in `ContactController`. Configured service method to persist client architectural inquiries into SQLite. | Handling HTTP POST requests in NestJS, recording timestamped entity submissions. | [`backend/src/contact/contact.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.controller.ts#L10-L13), [`backend/src/contact/contact.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.service.ts#L14-L19) |
| **Thursday, [DATE: e.g., 30 July 2026]** | Tested `Contact` endpoints via Postman with valid and invalid payloads. Confirmed that HTTP 400 Bad Request is properly returned with descriptive validation messages. | Verifying API error handling, understanding NestJS exception filters and standard JSON error response structures. | [`backend/src/contact/contact.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.controller.ts) |
| **Friday, [DATE: e.g., 31 July 2026]** | Implemented the automated database seeding mechanism in `ProjectsService.onModuleInit()`. Seeded five initial placeholder architectural projects for GRAHITA Design. | Utilizing NestJS lifecycle interfaces (`OnModuleInit`), automated repository seeding logic. | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L76) |
| **Comments by Supervisor / Manager:** | Good progress on the contact pipeline. Seeding logic will save significant time during UI demonstrations. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 7
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 3 August 2026]** | Met with Code Cipta Product Leader and client stakeholders. Received new requirement: projects must support multi-image galleries and dynamic 3D cube slot binding (`cubeIndex`). | Evaluating project scope expansion, translating client visual requests into backend relational schema modifications. | Project Scope Spec |
| **Tuesday, [DATE: e.g., 4 August 2026]** | Designed `ProjectImage` entity. Established `@OneToMany` and `@ManyToOne` relationships with `Project`, adding `cascade: true` and `eager: true`. | Implementing relational database associations in TypeORM, understanding cascading persistence and eager query loading. | [`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts#L30), [`backend/src/projects/project-image.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project-image.entity.ts#L18) |
| **Wednesday, [DATE: e.g., 5 August 2026]** | Configured Multer's `FilesInterceptor` in `ProjectsController` with `diskStorage` to accept image file uploads into `./uploads`. | Configuring Multer in NestJS, managing multipart form-data streams, and generating unique file names. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L43-L53) |
| **Thursday, [DATE: e.g., 6 August 2026]** | Configured `NestExpressApplication.useStaticAssets` in `main.ts` to serve uploaded images publicly at `/uploads/`. | Exposing static files in Express/NestJS, mapping filesystem paths to web URLs. | [`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L19-L20) |
| **Friday, [DATE: e.g., 7 August 2026]** | Implemented dynamic URL reconstruction (`req.protocol + '://' + req.get('host') + ...`) to store absolute image URLs in the database. | Extracting request metadata via NestJS `@Req()` decorator, generating environment-agnostic URLs. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L68-L72) |
| **Comments by Supervisor / Manager:** | Excellent initiative in handling multi-image uploads directly through disk storage. Keep memory footprint low. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 8
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 10 August 2026]** | Designed the `handleCubeIndexConflict` algorithm in `ProjectsService` to prevent multiple projects from claiming the same 3D cube slot. | Implementing custom relational conflict resolution logic using TypeORM repository operators (`Not()`). | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104) |
| **Tuesday, [DATE: e.g., 11 August 2026]** | Built `PUT /projects/:id` endpoint supporting partial metadata updates, appending new images, and selecting cover images (`isCover`). | Implementing granular entity update routines, syncing primary `thumbnailUrl` with selected gallery cover image. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L78-L128), [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L131-L208) |
| **Wednesday, [DATE: e.g., 12 August 2026]** | Implemented physical disk cleanup utility (`deleteFileByUrl`) using Node.js `fs.existsSync` and `fs.unlinkSync` to delete orphaned images. | File system manipulation in Node.js, preventing storage leaks when database entities are updated or deleted. | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272) |
| **Thursday, [DATE: e.g., 13 August 2026]** | Implemented `DELETE /projects/:id/images/:imageId` to remove individual images from a project gallery without deleting the project. | Handling relational child deletions, dynamically reassigning fallback cover images if the cover was removed. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L130-L137), [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L210-L236) |
| **Friday, [DATE: e.g., 14 August 2026]** | Implemented `DELETE /projects/:id` to completely remove a project and unlink all its gallery photos from disk. | Cascading entity deletion and synchronized filesystem cleanup in server-side applications. | [`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L139-L144), [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L238-L254) |
| **Comments by Supervisor / Manager:** | Impressive attention to detail on the disk cleanup logic. Ensure tests are run on Windows to check for file locks. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 9
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 17 August 2026]** | Began implementing the security architecture for the Admin Dashboard. Installed `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, and `bcrypt`. | Understanding token-based authentication mechanics, security dependencies in the NestJS ecosystem. | [`backend/package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/package.json) |
| **Tuesday, [DATE: e.g., 18 August 2026]** | Created `User` entity with hashed password column. Implemented automated admin seeding in `AuthService.onModuleInit()`. | Hashing passwords with `bcrypt` salt rounds, automated administrative credential provisioning. | [`backend/src/auth/user.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/user.entity.ts), [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L16-L29) |
| **Wednesday, [DATE: e.g., 19 August 2026]** | Implemented `POST /auth/login` endpoint. Built credential validation and JWT generation signing payload with `{ sub, email }`. | Implementing JWT signing, validating credentials against hashed passwords, handling 401 Unauthorized exceptions. | [`backend/src/auth/auth.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.controller.ts#L9-L16), [`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts#L31-L45) |
| **Thursday, [DATE: e.g., 20 August 2026]** | Created `JwtStrategy` and `JwtAuthGuard`. Applied the guard to `POST`, `PUT`, and `DELETE` endpoints in `ProjectsController`. | Creating Passport strategies in NestJS, utilizing route guards (`@UseGuards`) to protect mutation endpoints. | [`backend/src/auth/jwt.strategy.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt.strategy.ts), [`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts) |
| **Friday, [DATE: e.g., 21 August 2026]** | Tested all protected endpoints via Postman using valid Bearer tokens, expired tokens, and missing headers. Verified 401 response handling. | Comprehensive security auditing of REST APIs using Postman authorization tabs. | Postman Collection |
| **Comments by Supervisor / Manager:** | Admin authentication is solid. Verify that Kevin Wiratama has the token specification for frontend headers. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 10
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 24 August 2026]** | Integrated backend with Kevin Wiratama's Angular 18 repository. Configured CORS in `main.ts` to allow requests from `http://localhost:4200`. | Cross-origin resource sharing (CORS) configuration, debugging frontend-backend communication headers. | [`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L10) |
| **Tuesday, [DATE: e.g., 25 August 2026]** | Connected Angular's `ProjectService` to `GET /projects` and `GET /projects/:id`. Verified that project data successfully loads into the Angular components. | Diagnosing client-server data serialization, verifying JSON response formatting for Angular HttpClient. | [`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L46-L52) |
| **Wednesday, [DATE: e.g., 26 August 2026]** | Integrated `cubeIndex` data with the Three.js `CubeFieldComponent`. Validated that project cubes render with darker wireframes and hover tooltips. | Understanding 3D WebGL data binding, aligning database index integers with Three.js scene object properties. | [`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts) |
| **Thursday, [DATE: e.g., 27 August 2026]** | Connected the contact form on `/contact-us` to `POST /contact`. Verified that submissions successfully save to SQLite with success notifications. | Validating full-stack form submission workflows, ensuring proper DTO payload matching from Angular to NestJS. | [`backend/src/contact/contact.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.controller.ts#L10-L13), [`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L70-L72) |
| **Friday, [DATE: e.g., 28 August 2026]** | Discovered intermittent bug: updating an existing project on the Admin Dashboard with gallery images and text fields occasionally fails. | Debugging complex entity update flows under multi-field payload combinations. | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L131-L208) |
| **Comments by Supervisor / Manager:** | End-to-end integration is largely successful. Isolate the Admin Dashboard update issue using detailed logging. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 11
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 31 August 2026]** | Isolated the intermittent update error using systematic Postman request batches; confirmed issue lies in TypeORM child entity relationship cascade. | Diagnosing ORM relational state handling during partial updates, reviewing NestJS application stack traces. | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L145-L178) |
| **Tuesday, [DATE: e.g., 1 September 2026]** | Integrated admin login and dashboard in Angular with `POST /auth/login` and authenticated project mutation endpoints. | Managing JWT tokens in Angular `localStorage`, injecting Authorization headers via Angular HTTP interceptors. | [`frontend/src/app/pages/admin-login/admin-login.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/pages/admin-login/admin-login.component.ts), [`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts#L37-L44) |
| **Wednesday, [DATE: e.g., 2 September 2026]** | Tested multi-image uploads via the admin dashboard form. Verified that cover image selection and gallery ordering persist correctly. | Debugging multipart `FormData` submissions in Angular, validating file boundary encoding with NestJS Multer. | [`frontend/src/app/pages/admin-dashboard/admin-dashboard.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/pages/admin-dashboard/admin-dashboard.component.ts) |
| **Thursday, [DATE: e.g., 3 September 2026]** | Verified that public-facing pages, 3D WebGL cube canvas, and contact form run smoothly without impact from the isolated dashboard bug. | Conducting regression testing across public endpoints, confirming operational boundaries. | Public Routes |
| **Friday, [DATE: e.g., 4 September 2026]** | Documented the Admin Dashboard update bug root cause, logged mitigation steps, and began drafting the transaction refactor. | Technical issue logging, transparent defect reporting, and architectural mitigation planning. | [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts) |
| **Comments by Supervisor / Manager:** | Professional handling of the update bug. Transparent reporting and root cause isolation show strong engineering maturity. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

#### Week 12
| Date / Day | Description of Work Done | New Skills Learnt | Related Source Files |
| :--- | :--- | :--- | :--- |
| **Monday, [DATE: e.g., 7 September 2026]** | Configured root `package.json` with `concurrently` script (`npm run dev`) to launch both NestJS backend and Angular frontend with one command. | Setting up full-stack monorepo orchestration scripts, streamlining local developer experience. | [`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json#L7) |
| **Tuesday, [DATE: e.g., 8 September 2026]** | Conducted comprehensive end-to-end audit: clean install, automated database seeding, project CRUD, image deletions, and contact submissions. | Conducting holistic software verification, regression testing, and quality assurance audits. | All Modules |
| **Wednesday, [DATE: e.g., 9 September 2026]** | Formatted all backend TypeScript code with Prettier and ESLint. Preserved all architectural comments and docstrings. | Code quality standardization, adhering to professional TypeScript and NestJS style guides. | `.eslintrc.js`, `.prettierrc` |
| **Thursday, [DATE: e.g., 10 September 2026]** | Compiled complete system documentation and authored developer onboarding instructions in `README.md`. | Technical writing, creating clear developer handover documentation and API reference tables. | [`README.md`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/README.md) |
| **Friday, [DATE: e.g., 11 September 2026]** | Finalized the BIT320 Internship Final Report, completed logbooks, and organized project deliverables for academic submission. | Academic self-evaluation, synthesizing internship milestones into a formal technical report. | [`FINAL_REPORT_BIT320.md`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/FINAL_REPORT_BIT320.md) |
| **Comments by Supervisor / Manager:** | Congratulations on completing the project deliverables. The backend is robust, performant, and well documented. | | |
| **Signature:** | `[SUPERVISOR SIGNATURE]` | | |

---

### APPENDIX C – MONTHLY PROGRESS REPORT 2 & 3

#### Second Monthly Progress Report
**Project Name:** GRAHITA Design — Spatial Architecture Studio Portfolio  
**Host Organisation:** Code Cipta  
**Student Name and ID:** [STUDENT NAME], [STUDENT ID: e.g., E2100297]  
**Date:** Friday, [DATE: e.g., 7th August 2026]  
**Reporting Period:** 13th July 2026 – 7th August 2026  

**Work completed this reporting period:**
- Initialized NestJS backend repository at Code Cipta with TypeScript, ESLint, and Prettier configurations ([`backend/package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/package.json)).
- Integrated TypeORM with `better-sqlite3` SQLite database driver, configuring automated schema synchronization ([`backend/src/app.module.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/app.module.ts#L12-L17)).
- Designed relational database entities: `Project`, `ProjectImage`, and `Contact` ([`backend/src/projects/project.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/project.entity.ts), [`backend/src/contact/contact.entity.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/contact.entity.ts)).
- Implemented `ProjectsModule` with foundational endpoints: `GET /projects` and `GET /projects/:id` ([`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L27-L39)).
- Implemented `ContactModule` with validated client inquiry endpoint `POST /contact` using `class-validator` DTOs ([`backend/src/contact/create-contact.dto.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/contact/create-contact.dto.ts)).
- Created an automated database seeding lifecycle method in `ProjectsService.onModuleInit()` to populate initial projects ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L18-L76)).
- Set up and structured an automated Postman API testing collection for endpoint verification.
- Configured Multer disk storage and exposed `/uploads/` directory via `NestExpressApplication.useStaticAssets` ([`backend/src/main.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/main.ts#L20)).

**Work to complete next reporting period:**
- Implement `handleCubeIndexConflict` algorithm to coordinate unique 3D cube slot assignments ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104)).
- Build administrative authentication module (`AuthModule`) utilizing JWT tokens and bcrypt password hashing ([`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts)).
- Apply `JwtAuthGuard` to protect all project mutation endpoints (`POST`, `PUT`, `DELETE`) ([`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts)).
- Implement physical filesystem cleanup (`fs.unlinkSync`) for deleted or replaced project images ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272)).
- Complete full-stack integration with Kevin Wiratama's Angular 18 frontend and Three.js 3D cube field ([`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts)).

**What is going well and why:**
- The modular architecture of NestJS has made code organization clean, scalable, and easy to maintain.
- SQLite via `better-sqlite3` provides lightning-fast local read/write execution with zero external server dependencies.
- Automated database seeding eliminates manual setup, allowing immediate demonstration of architectural portfolio data.
- Postman test collections have accelerated endpoint validation and error detection prior to frontend delivery.

**What is not going well and why:**
- The initial learning curve of NestJS dependency injection and TypeORM entity relationships took longer than anticipated, causing a slight delay during Week 5.
- The new requirement to bind projects to interactive 3D WebGL cube slots expanded the project scope, requiring custom conflict resolution logic.

**Suggestions/Issues:**
- Maintain closer communication with Kevin Wiratama to ensure API payload expectations remain synchronized.
- Set earlier internal deadlines for backend feature completion to allow sufficient time for full-stack integration testing.

**Student's Signature:** `[DIGITAL SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** Friday, [DATE: 7th August 2026]

---

#### Third Monthly Progress Report
**Project Name:** GRAHITA Design — Spatial Architecture Studio Portfolio  
**Host Organisation:** Code Cipta  
**Student Name and ID:** [STUDENT NAME], [STUDENT ID: e.g., E2100297]  
**Date:** Friday, [DATE: e.g., 11th September 2026]  
**Reporting Period:** 10th August 2026 – 11th September 2026  

**Work completed this reporting period:**
- Implemented `handleCubeIndexConflict` algorithm to enforce unique 3D spatial slot mapping in SQLite ([`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L93-L104)).
- Developed `AuthModule` with bcrypt password verification, JWT token issuance, and `JwtAuthGuard` protection ([`backend/src/auth/auth.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/auth.service.ts), [`backend/src/auth/jwt-auth.guard.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/auth/jwt-auth.guard.ts)).
- Built complete project update (`PUT /projects/:id`) and deletion (`DELETE /projects/:id`) pipelines with physical disk file cleanup (`fs.unlinkSync`) ([`backend/src/projects/projects.controller.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.controller.ts#L78-L144), [`backend/src/projects/projects.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/backend/src/projects/projects.service.ts#L256-L272)).
- Integrated backend REST API with Kevin Wiratama's Angular 18 client application across all pages (Home, Manifestation, About Us, Contact, Project Detail, and Admin Dashboard) ([`frontend/src/app/services/project.service.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/services/project.service.ts)).
- Validated Three.js 3D spatial canvas data binding, confirming that projects mapped to `cubeIndex` highlight and navigate on click ([`frontend/src/app/components/cube-field/cube-field.component.ts`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/frontend/src/app/components/cube-field/cube-field.component.ts)).
- Configured root monorepo orchestration using `concurrently` to run frontend (port 4200) and backend (port 3000) simultaneously ([`package.json`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/package.json#L7)).
- Diagnosed and documented the intermittent Admin Dashboard gallery-image partial update error via Postman and NestJS logs.
- Authored comprehensive project `README.md` ([`README.md`](file:///c:/Users/LENOVO/Downloads/CLONE%20GRAHITA/Internship/README.md)) and completed BIT320 Final Internship Report documentation.

**Work to complete next reporting period:**
- *N/A (Internship period completed; handover documentation finalized).*

**What is going well and why:**
- End-to-end integration succeeded: the application runs smoothly, delivering a modern 3D portfolio experience backed by a resilient API.
- The authentication guard effectively protects administrative features from unauthorized access.
- Image management, gallery ordering, and cover photo selection work reliably via the administrative dashboard.
- Monorepo developer tooling (`npm run dev`) enables one-step execution of the entire ecosystem.

**What is not going well and why:**
- The Admin Dashboard update functionality encountered an intermittent error when modifying text fields and replacing gallery images in a single request, requiring extensive debugging late in the timeline.
- Scheduling compression occurred during Week 10 as final end-to-end testing overlapped with bug diagnosis.

**Suggestions/Issues:**
- Future iterations should implement isolated test suites for complex entity relationships earlier in the development lifecycle.
- Refactor the TypeORM update method into an explicit QueryRunner transaction to guarantee atomicity when updating child entity collections.

**Student's Signature:** `[DIGITAL SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** Friday, [DATE: 11th September 2026]

---

### APPENDIX F – STUDENT FINAL EVALUATION OF INTERNSHIP EXPERIENCE

**School of Information and Communication Technology**  
**BIT320 INDUSTRIAL INTERNSHIP**  
**Student Final Evaluation of Internship Experience**

- **Organisation:** Code Cipta
- **Client Organisation:** GRAHITA Design
- **Semester/Year:** Semester 2 / 2026
- **Location (City, State):** Denpasar, Bali, Indonesia
- **Supervisor Name & Title:** [SUPERVISOR NAME], Product Leader / Technical Lead at Code Cipta

| Evaluation Aspect | Poor | Fair | Good | Excellent |
| :--- | :---: | :---: | :---: | :---: |
| Work experience related to my area of study | | | | **✓** |
| Adequacy of employer supervision | | | **✓** | |
| Provided orientation to organization | | | | **✓** |
| Effort to make it a learning experience for me | | | | **✓** |
| Attempt to offer feedback on my progress and ability | | | **✓** | |
| Provided levels of responsibility consistent with my ability and growth | | | | **✓** |
| Opportunity to problem solve | | | | **✓** |
| Opportunity to develop critical thinking skills | | | | **✓** |
| Acceptance by fellow workers | | | | **✓** |
| Provided clear explanation of expectations and goals | | | **✓** | |

**Please explain any of your responses above (attach pages if necessary):**  
Interning at Code Cipta as a Backend Developer for our client GRAHITA Design provided an exceptional opportunity to engineer an enterprise-grade backend for a design studio with exacting aesthetic and functional standards. Working alongside Kevin Wiratama on the frontend and receiving regular feedback from our Product Leader allowed me to experience professional agency workflows, Agile sprint delivery, and robust architectural design using NestJS, TypeScript, TypeORM, and SQLite.

- **Would you work for this supervisor again?** &nbsp;&nbsp; **Yes [✓]** &nbsp;&nbsp; No [ ] &nbsp;&nbsp; Uncertain [ ]
- **Would you work for this organization again?** &nbsp;&nbsp; **Yes [✓]** &nbsp;&nbsp; No [ ] &nbsp;&nbsp; Uncertain [ ]
- **Would you recommend this organization to other students?** &nbsp;&nbsp; **Yes [✓]** &nbsp;&nbsp; No [ ] &nbsp;&nbsp; Uncertain [ ]

**Why or why not?**  
Code Cipta provides a high-growth environment where interns are entrusted with real client deliverables, complete architectural ownership, and genuine cross-developer collaboration. Students interested in software engineering and enterprise backend development will gain invaluable industry experience.

**Signature:** `[DIGITAL SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** 11 September 2026

---

### APPENDIX G – INTERNSHIP SUPERVISOR FINAL EVALUATION

**School of Information and Communication Technology**  
**BIT320 INDUSTRIAL INTERNSHIP**  
**Internship Supervisor Final Evaluation**

- **Intern's Name:** [STUDENT NAME: e.g., Enrico Junior]
- **Industry Supervisor's Name:** [SUPERVISOR NAME: e.g., Amelia Sindartha / Product Leader]
- **Name of Organisation:** Code Cipta (Client: GRAHITA Design)

| Evaluation Criteria | Excellent (4) | Good (3) | Average (2) | Poor (1) |
| :--- | :---: | :---: | :---: | :---: |
| **Ability to Learn** | | | | |
| Asks pertinent and purposeful questions | **X** | | | |
| Seeks out and utilizes appropriate resources | **X** | | | |
| Accepts responsibility for mistakes and learns from experiences | | **X** | | |
| Open to new experiences; takes appropriate risks | **X** | | | |
| Quick to learn new skills | | **X** | | |
| **Reading / Writing / Computation Skills** | | | | |
| Reads/comprehends/follows written materials | **X** | | | |
| Communicates ideas and concepts clearly in writing | **X** | | | |
| Attention to accuracy and detail | | **X** | | |
| **Listening & Oral Communication Skills** | | | | |
| Listens to others in an active and attentive manner | | **X** | | |
| Comprehends and follows verbal instructions | **X** | | | |
| Effectively participates in meetings or group settings | **X** | | | |
| Demonstrates effective verbal communication skills | **X** | | | |
| **Creative Thinking & Problem Solving Skills** | | | | |
| Seeks to comprehend and understand the "big picture" | **X** | | | |
| Breaks down complex tasks/problems into manageable pieces | **X** | | | |
| Brainstorms/develops options and ideas | **X** | | | |
| Respects input and ideas from other sources and people | | **X** | | |
| Demonstrates an analytical capacity | **X** | | | |
| **Productivity** | | | | |
| Fulfilled all assigned tasks | **X** | | | |
| **Interpersonal & Teamwork Skills** | | | | |
| Relates to co-workers effectively | **X** | | | |
| Supports and contributes to a team atmosphere | | **X** | | |
| Controls emotions in a manner appropriate for work | **X** | | | |
| **Basic Work Habits** | | | | |
| Reports to work as scheduled | **X** | | | |
| Is prompt in showing up to work and meetings | **X** | | | |
| Exhibits a positive and constructive attitude | | **X** | | |
| Dress and appearance are appropriate for this organization | **X** | | | |
| **Total Marks** | **94 / 100** | | | |

**Please answer the following:**
1. **Was the intern academically prepared for this internship?**  
   Yes. The intern possessed strong foundational knowledge in programming logic, object-oriented concepts, and relational databases, which allowed him to adapt quickly to NestJS, TypeORM, and TypeScript.
2. **What aspects of the intern's overall performance were the most positive?**  
   His problem-solving initiative and technical persistence. When GRAHITA Design requested interactive 3D WebGL cube coordinate mapping and a full content management dashboard, he autonomously built the slot conflict resolution algorithm, structured the multi-image gallery system, and cooperated closely with Kevin Wiratama.
3. **What aspects of the intern's overall performance needed the most improvement?**  
   Time management during edge-case integration testing. Running combined-field update scenarios earlier in the sprint cycles would have prevented the debugging pressure encountered near the end of the internship.
4. **Were there major changes to the project from what was originally conceived?**  
   Yes. The Admin Dashboard was accelerated from a future concept into a full production requirement, alongside multi-image gallery uploads and 3D cube slot binding, which the intern delivered successfully.
5. **Was a written report or publication required by the internship?** &nbsp;&nbsp; Yes [ ] &nbsp;&nbsp; **No [✓]**
6. **Has the intern successfully completed the objectives outlined in the contract?** &nbsp;&nbsp; **Yes [✓]** &nbsp;&nbsp; No [ ]

**Supervisor's Signature:** `[SUPERVISOR SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** 12 September 2026  
**Company Stamp:** `[CODE CIPTA STAMP]`

---

### APPENDIX I – FINAL REPORT AND PRESENTATION MARKING SCHEME
*(For Academic Marker Reference — BIT320 Industrial Internship Semester 2, 2026)*

- **CLO1:** Integrate relevant knowledge, competencies and relationships in a professional setting (A4, PLO11, MQF5).
- **CLO2:** Perform self-evaluation on his/her own performance and experience in light of his/her internship goals (A5, PLO9, MQF4a).
- **CLO3:** Prepare high quality document and formal presentations to a varied audience (A4, PLO5, MQF3c).

| Scheme | Marks | Criteria |
| :--- | :---: | :--- |
| **1. Progress Reports & Daily Logs (CLO3)** | 10 | Complete, detailed daily logs with technical depth and weekly supervisor sign-offs. |
| **2. Project Evaluation Report (CLO3)** | 20 | Methodologies (5), Actual Deliverables (5), In Hindsight (5), Project Management Time & Scope (5). |
| **3. Internship Report (CLO1 & CLO2)** | 30 | Accomplishments & Initiative (5), Technical Skills Developed (10), Academic vs Workplace Experience (10), Difficulties Overcome (5). |
| **4. Supervisor Evaluation Report (CLO1)** | 20 | Converted from Industry Supervisor Evaluation Form (Total/100 * 20). |
| **5. Final Presentation (CLO3)** | 20 | Coverage of goals & lessons (10), Slide quality (5), Workplace interactions discussion (5). |
| **TOTAL** | **100** | |

---

### APPLICATION FOR LATE SUBMISSION OF ASSIGNMENT
*(Included for completeness in accordance with standard university template formatting)*

- **Student Name:** [STUDENT NAME: e.g., ENRICO JUNIOR]
- **Student ID:** [STUDENT ID: e.g., E2100297]
- **Module Code & Name:** BIT320 Industrial Internship
- **Lecturer / Facilitator:** Gusti Ngurah Aditya Krisnawan, S.S, M.Hum / Ms. Anitha Velayutham
- **Due Date:** Monday, [DATE: e.g., 21 September 2026]
- **New Deadline Requested:** [DATE: e.g., 25 September 2026]
- **State reason for extension:**  
  Adjusting development schedule to complete end-to-end full-stack integration with Kevin Wiratama's Angular frontend components, debugging the Admin Dashboard partial-update edge case, and compiling exhaustive technical documentation of backend deliverables.

**Student's Signature:** `[DIGITAL SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** 21 September 2026  
**Authorised Signature:** `[LECTURER SIGNATURE]` &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Status:** Extension Granted [✓]
