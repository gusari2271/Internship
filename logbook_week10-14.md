# IT INTERNSHIP LOGBOOK (Appendix B)
**Student Name:** I Putu Agus Aribawa  
**Student ID:** E2400080  
**Programme:** BIT (Hons)  
**Host Organisation:** Code Cipta  
**Client Organisation:** GRAHITA Design  
**Role:** Backend Developer  
**Period:** Wednesday, 2 September 2026 – Friday, 2 October 2026 (Weeks 10 – 14)  

---

### Week 10 (Continued)

| Date / Day | Description of Work Done | New Skills Learnt |
| :--- | :--- | :--- |
| **Wednesday, 2 September 2026** | • Implemented the `AuthModule` and `AuthService` in NestJS to establish the core authentication infrastructure for administrative access.<br>• Created the `User` entity to represent administrator credentials, incorporating secure password hashing via `bcrypt` with appropriate salt rounds.<br>• Built the `POST /auth/login` endpoint to validate administrator credentials against stored hashes and issue signed JSON Web Tokens (JWT) containing administrative claims. | • JWT Authentication Architecture<br>• Password Hashing with Bcrypt<br>• NestJS AuthModule Configuration |
| **Thursday, 3 September 2026** | • Applied the `JwtAuthGuard` to mutation endpoints (`POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`) in `ProjectsController` to restrict content modifications to authenticated administrators.<br>• Verified that public read endpoints (`GET /projects`, `GET /projects/:id`, `GET /projects/pane-status`) remain accessible without authentication for portfolio visitors.<br>• Conducted comprehensive Postman tests using valid Bearer tokens, expired tokens, and missing authorization headers to verify proper HTTP 401 Unauthorized handling. | • Route Protection with Guards<br>• Postman Authorization Header Testing<br>• HTTP Security Status Verification |
| **Friday, 4 September 2026** | • Committed and pushed the completed authentication module, guards, and entity files to the GitHub repository with clean, descriptive commit messages.<br>• Held a weekly progress review meeting with the supervisor to demonstrate the completed JWT authentication flow and route protection on administrative endpoints.<br>• Received positive supervisor feedback on the security architecture and outlined next week's focus on refining the bilingual API response structure, pagination, and error filtering. | • Git Commit Documentation Skills<br>• Technical Demonstration Skills<br>• Stakeholder Feedback Incorporation |

**Comments by Supervisor / Manager:**

<br><br>

**Signature:**

<br>

---

### Week 11

| Date / Day | Description of Work Done | New Skills Learnt |
| :--- | :--- | :--- |
| **Monday, 7 September 2026** | • Conducted weekly sprint planning to break down technical priorities, focusing on finalizing the bilingual API response structure, pagination, and global error handling.<br>• Applied time-blocking techniques to balance backend coding tasks, social media content creation, and coordination with Kevin for frontend integration.<br>• Reviewed bilingual content requirements across the `Project` entity (`title_id`, `title_en`, `description_id`, `description_en`) to ensure data consistency between Indonesian and English versions. | • Sprint Task Prioritization<br>• Time-Blocking Technique<br>• Bilingual Data Modeling |
| **Tuesday, 8 September 2026** | • Researched, designed, and published this week's educational Instagram carousel post about mobile phone fun facts, focusing on the evolution of mobile display and touchscreen technologies (from resistive panels to capacitive AMOLED).<br>• Recorded, edited, and published the monthly educational video for September, explaining how smartphone miniaturization and processor fabrication nodes have evolved over the decades.<br>• Collaborated with Kevin to standardize the bilingual API response shape, confirming query parameter handling (`?lang=id` or `?lang=en`) for the frontend language switcher. | • Educational Video Production<br>• Social Media Content Strategy<br>• API Contract Standardization |
| **Wednesday, 9 September 2026** | • Implemented pagination (`page` and `limit` query parameters with TypeORM `skip` and `take`) and category filtering on the `GET /projects` endpoint in `ProjectsService`.<br>• Implemented a global exception filter in NestJS to standardize error responses into a consistent JSON envelope across the entire backend application.<br>• Validated pagination boundary edge cases in Postman, verifying that requests with out-of-range offsets return appropriate empty arrays without throwing unhandled server exceptions. | • Database Pagination with TypeORM<br>• NestJS Global Exception Filters<br>• Edge-Case Query Testing |
| **Thursday, 10 September 2026** | • Configured `@nestjs/swagger` in `main.ts` and decorated controllers and DTOs with OpenAPI annotations (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) to produce interactive API documentation.<br>• Updated the automated database seeder (`onModuleInit`) with enriched bilingual descriptions and verified gallery image arrays for all default architectural projects.<br>• Shared the generated Swagger UI endpoint (`/api/docs`) and updated Postman collection with Kevin to facilitate seamless frontend integration. | • Swagger/OpenAPI Documentation<br>• Database Seeder Enrichment<br>• Developer Tooling Collaboration |
| **Friday, 11 September 2026** | • Authored unit tests using Jest for `ProjectsService` and `AuthService`, testing CRUD methods, credential verification, and cube index conflict handling.<br>• Conducted a weekly progress review and code demonstration with the supervisor, showcasing the live Swagger documentation and passing Jest test suites.<br>• Discussed deployment prerequisites and hosting options with the supervisor, compiling a preparation checklist for next week's staging release. | • Unit Testing with Jest<br>• Test-Driven Verification Skills<br>• Production Readiness Assessment |

**Comments by Supervisor / Manager:**

<br><br>

**Signature:**

<br>

---

### Week 12

| Date / Day | Description of Work Done | New Skills Learnt |
| :--- | :--- | :--- |
| **Monday, 14 September 2026** | • Formulated a comprehensive deployment roadmap for the backend, identifying necessary server environment configurations and security requirements.<br>• Disabled TypeORM's automatic `synchronize: true` for the production configuration, migrating to safer explicit schema synchronization and backup procedures.<br>• Set up environment variable management with `.env.production`, separating development database paths and secrets from production settings. | • Production Deployment Planning<br>• Database Migration Safety Practices<br>• Environment Variable Segregation |
| **Tuesday, 15 September 2026** | • Researched, designed, and published this week's educational Instagram post covering mobile phone fun facts, highlighting the history of camera sensors from the first 0.11 MP phone camera in 2000 to modern periscope zoom lenses.<br>• Implemented application-level request logging using NestJS built-in `Logger` to track incoming HTTP requests, response status codes, and execution latency.<br>• Configured production static asset serving in `main.ts`, ensuring uploaded portfolio images in `/uploads` are served with proper caching headers and security checks. | • Mobile Tech History Research<br>• NestJS Built-in Logger Implementation<br>• Static Asset Delivery Optimization |
| **Wednesday, 16 September 2026** | • Set up the production cloud hosting environment, installing Node.js LTS, PM2 process manager, and Nginx as a reverse proxy.<br>• Configured PM2 ecosystem files to keep the NestJS application running continuously with automatic restarts upon system reboots or runtime failures.<br>• Deployed the NestJS backend application to the live server, verified that the SQLite database file initialized correctly, and confirmed the health-check route. | • Cloud Server Provisioning<br>• PM2 Process Management<br>• Nginx Reverse Proxy Configuration |
| **Thursday, 17 September 2026** | • Connected the deployed backend with Kevin's deployed frontend, updating CORS settings in `main.ts` to whitelist the live frontend production domain.<br>• Attended a scheduled client demonstration meeting with Bli Dek, the supervisor, and Kevin, previewing the live staging website, portfolio layout, and 3D spatial cube navigation.<br>• Gathered preliminary feedback from Bli Dek regarding image upload speed and specific architectural terminology on project detail pages. | • Production CORS Configuration<br>• Client Staging Demonstration<br>• Client Feedback Gathering |
| **Friday, 18 September 2026** | • Resolved a minor URL resolution issue in `projects.controller.ts` where image paths needed to reflect the production HTTPS domain rather than localhost.<br>• Ran end-to-end integration tests between the live frontend and backend alongside Kevin, confirming image uploads and contact form submissions operate reliably.<br>• Held a weekly progress review meeting with the supervisor to assess the deployed staging environment and plan next week's formal User Acceptance Testing (UAT). | • Production Domain URL Resolution<br>• End-to-End System Smoke Testing<br>• Weekly Deployment Review |

**Comments by Supervisor / Manager:**

<br><br>

**Signature:**

<br>

---

### Week 13

| Date / Day | Description of Work Done | New Skills Learnt |
| :--- | :--- | :--- |
| **Monday, 21 September 2026** | • Outlined the sprint goals for the week, prioritizing client feedback items from Bli Dek, rate limiting, and drafting the BIT320 Final Report.<br>• Applied the Eisenhower Matrix to organize tasks into urgent client adjustments versus non-urgent report documentation tasks to prevent schedule slippage.<br>• Created a detailed User Acceptance Testing (UAT) test scenario checklist covering all core user journeys for client verification. | • Eisenhower Matrix Prioritization<br>• UAT Scenario Design<br>• Release Schedule Management |
| **Tuesday, 22 September 2026** | • Researched, drafted, and posted this week's educational Instagram carousel on mobile phone fun facts, discussing the evolution of smartphone battery technology and fast charging (from NiCad to Silicon-Carbon and GaN chargers).<br>• Implemented rate limiting across the API using `@nestjs/throttler` (`ThrottlerModule`), applying strict limits on the `POST /contact` and `POST /auth/login` endpoints to prevent spam and brute-force attacks.<br>• Added `helmet` security middleware to HTTP response headers to protect against common web vulnerabilities like cross-site scripting (XSS) and clickjacking. | • Educational Tech Storytelling<br>• API Rate Limiting with Throttler<br>• HTTP Security Header Hardening |
| **Wednesday, 23 September 2026** | • Conducted the formal User Acceptance Testing (UAT) session with client Bli Dek, Kevin, and the supervisor, systematically validating each feature against the project requirements.<br>• Guided the client through submitting architectural inquiries via the contact form, verifying project filters, and testing administrative updates in the dashboard.<br>• Documented the client's official UAT approval notes and noted minor requests for updated architectural project descriptions and image sequence adjustments. | • User Acceptance Testing Protocol<br>• Client-Facing Feature Walkthrough<br>• Technical Defect and Request Logging |
| **Thursday, 24 September 2026** | • Updated project database records with the revised architectural project descriptions, locations, and high-resolution cover photos provided by Bli Dek.<br>• Authored an automated SQLite database backup script that creates scheduled timestamped snapshots of `db.sqlite` to protect against accidental data loss.<br>• Verified database restore functionality by successfully restoring a test backup copy without data corruption or index mismatches. | • Production Data Content Refinement<br>• SQLite Automated Backup Scripting<br>• Database Disaster Recovery Testing |
| **Friday, 25 September 2026** | • Conducted API performance benchmarking using autocannon, confirming that the NestJS backend handles concurrent portfolio queries with sub-50ms latency.<br>• Began drafting the initial sections of the BIT320 Industrial Internship Final Report, focusing on project background, system architecture, and SDLC methodology.<br>• Met with the supervisor for the weekly progress review, presenting the successful UAT sign-off document and discussing the outline for the Final Report. | • API Performance Benchmarking<br>• Technical Academic Report Drafting<br>• Supervisory Milestone Alignment |

**Comments by Supervisor / Manager:**

<br><br>

**Signature:**

<br>

---

### Week 14

| Date / Day | Description of Work Done | New Skills Learnt |
| :--- | :--- | :--- |
| **Monday, 28 September 2026** | • Conducted the final sprint planning session of the internship, creating a comprehensive checklist for project handover, code documentation, and academic report submission.<br>• Coordinated with Kevin to inspect final UI-to-API bindings and ensure all visual assets and architectural copy were finalized across all pages.<br>• Reviewed the remaining deliverables outlined in the BIT320 handbook to verify that all appendices and submission criteria were accounted for. | • Project Handover Planning<br>• Deliverables Verification<br>• Cross-Functional Final Audit |
| **Tuesday, 29 September 2026** | • Researched, designed, and published the final educational Instagram post on mobile phone fun facts, chronicling the dawn of smartphones from the IBM Simon in 1994 to modern 3nm AI system-on-chips.<br>• Resolved edge-case bug fixes in the contact inquiry pipeline, configuring the `MailModule` and Nodemailer transporter to ensure automated inquiry notifications and confirmations dispatch reliably without console warnings.<br>• Assisted Kevin in fine-tuning the admin dashboard catalog table styles, ensuring action buttons and thumbnail images align cleanly across all screen sizes. | • Mobile Computing History Synthesis<br>• Nodemailer SMTP Dispatch Configuration<br>• Collaborative Frontend-Backend Bug Fixing |
| **Wednesday, 30 September 2026** | • Attended the final project handover meeting with client Bli Dek, the supervisor, and Kevin, officially delivering the completed Grahita Design web platform.<br>• Provided Bli Dek with the administrative credentials, demonstrated the content management workflows, and explained the automatic cube slot synchronization feature.<br>• Received formal acceptance and enthusiastic appreciation from Bli Dek for delivering a modern, responsive, and 3D-integrated architecture portfolio platform. | • Formal Project Handover Execution<br>• Client System Handover Skills<br>• Professional Communication & Demeanor |
| **Thursday, 1 October 2026** | • Finalized the technical documentation in `README.md`, including detailed local setup guides, environment variables, API endpoints list, and production deployment instructions.<br>• Completed the comprehensive BIT320 Industrial Internship Final Report (`FINAL_REPORT_BIT320.md`), thoroughly detailing project accomplishments, technical challenges, and personal growth.<br>• Prepared presentation slides for the final internship defense, summarizing the backend architecture, 3D WebGL integration, and key engineering takeaways. | • Technical Documentation Finalization<br>• Comprehensive Report Synthesis<br>• Presentation Preparation Skills |
| **Friday, 2 October 2026** | • Attended the final internship evaluation and exit meeting with the workplace supervisor at Code Cipta to review overall performance and project achievements.<br>• Received constructive feedback and supervisor evaluation scores on the BIT320 assessment rubrics, along with the official supervisor signature on internship completion documents.<br>• Wrote a comprehensive personal reflection on the 14-week internship experience, highlighting technical competence gained in NestJS and TypeORM as well as professional teamwork growth.<br>• Packaged and submitted all final academic deliverables (Final Report, Logbook Appendix B, Monthly Progress Reports, and repository link) to HELP University. | • Professional Performance Appraisal<br>• Reflective Engineering Assessment<br>• Formal Academic Submission |

**Comments by Supervisor / Manager:**

<br><br>

**Signature:**

<br>
