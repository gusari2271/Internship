# HELP UNIVERSITY — BIT320 INDUSTRIAL INTERNSHIP
## Assignment Cover Sheet

| Student Information (For group assignment, please state names of all members) | Grade / Marks |
| :--- | :--- |
| **Name:** I PUTU AGUS ARIBAWA | **ID:** E2400080 |

| Module / Subject Information | Office Acknowledgement |
| :--- | :--- |
| **Module/Subject Code:** BIT 320 | |
| **Module/Subject Name:** Industrial Internship | |
| **Lecturer/Tutor/Facilitator:** Ms. Ayu Chrisniyanti S.Kom.,BIT.,MBA / Ms. Anitha Velayuktam | |
| **Due Date:** 2nd October 2026 | |
| **Assignment Title/Topic:** Third Monthly Progress Report and Logbook | |
| **Intake (where applicable):** Sem July, 2026 | |
| **Word Count:** ~1,850 words | **Date/Time:** 2nd October 2026 |

### Declaration
- I/We have read and understood the Programme Handbook that explains on plagiarism, and I/we testify that, unless otherwise acknowledged, the work submitted herein is entirely my/our own.
- I/We declare that no part of this assignment has been written for me/us by any other person(s) except where such collaboration has been authorized by the lecturer concerned.
- I/We authorize the University to test any work submitted by me/us, using text comparison software, for instances of plagiarism. I/We understand this will involve the University or its contractors copying my/our work and storing it on a database to be used in future to test work submitted by others.

*Note:*  
1) The attachment of this statement on any electronically submitted assignments will be deemed to have the same authority as a signed statement.  
2) The Group Leader signs the declaration on behalf of all members.

**Signature:** `[DIGITAL SIGNATURE / I PUTU AGUS ARIBAWA]`  
**Date:** 2 October 2026  
**E-mail:** 230030591@stikom-bali.ac.id  

---

## Feedback / Comments Sheet

| Feedback / Comments* |
| :--- |
| **Main Strengths:**<br><br><br><br> |
| **Main Weaknesses:**<br><br><br><br> |
| **Suggestions for improvement:**<br><br><br><br> |

| Student acknowledge feedback/comments |
| :--- |
| **Grader's signature:** ____________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Student's signature:** `[SIGNATURE]` |
| **Date:** ____________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** 2 October 2026 |

*Note:*  
1) A soft and hard copy of the assignment shall be submitted.  
2) The signed copy of the assignment cover sheet shall be retained by the marker.  
3) If the Turnitin report is required, students have to submit it with the assignment. However, departments may allow students up to THREE (3) working days after submission of the assignment to submit the Turnitin report. The assignment shall only be marked upon the submission of the Turnitin report.  
*Use additional sheets if required.

---

<br>

# Monthly Progress Report (Appendix C)

**Project Name:** Grahita Design Website (Spatial Architecture Studio Portfolio Web Platform)  
**Student Name and ID:** I Putu Agus Aribawa (E2400080)  
**Date:** 2 October 2026  
**Reporting Period:** 2 September 2026 – 2 October 2026 (Weeks 10 – 14)  

---

### Work completed this reporting period:

- **Completed Administrative Authentication & Access Control:** Implemented the complete `AuthModule` and `AuthService` in NestJS with bcrypt password hashing (10 salt rounds) and JWT signing. Created the `User` entity to represent administrator credentials, built the `POST /auth/login` endpoint, and applied the `JwtAuthGuard` across all mutation endpoints (`POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id`) in `ProjectsController` to restrict administrative actions while keeping public portfolio read routes accessible.
- **Finalized Bilingual API & Localization Pipeline:** Completed the bilingual architecture for portfolio projects and contact inquiries (`title_id`/`title_en`, `description_id`/`description_en`). Standardized query parameter handling (`?lang=id` or `?lang=en`) and verified consistent response formatting with Kevin for the Angular frontend language toggle.
- **Implemented Global Exception Filter & Pagination:** Built a NestJS global exception filter to standardize all error responses into a consistent JSON envelope with timestamps, status codes, and user-friendly error messages. Implemented database pagination (`page` and `limit` with TypeORM `skip` and `take`) and category filtering on `GET /projects`, verifying boundary edge cases via Postman.
- **API Documentation & Seeder Updates:** Configured `@nestjs/swagger` in `main.ts` with comprehensive OpenAPI decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`), generating interactive API documentation at `/api/docs`. Enriched the database seeder (`onModuleInit`) with realistic bilingual descriptions and verified gallery image datasets for all default architectural projects.
- **Automated Unit Testing with Jest:** Authored automated unit test suites for `ProjectsService` and `AuthService` using Jest, testing CRUD methods, credential verification, and cube index conflict resolution with 100% passing assertions.
- **Production Deployment Preparation & Server Configuration:** Formulated the deployment roadmap, disabled TypeORM's automatic `synchronize: true` in favor of production migration safety, and created `.env.production`. Provisioned cloud hosting with Node.js LTS, PM2 process management with auto-restart, and Nginx reverse proxy.
- **Live Deployment & Full-Stack Integration:** Deployed the NestJS backend and SQLite database to production, configured production CORS to whitelist Kevin's live Angular domain, and resolved production HTTPS image URL generation. Conducted comprehensive end-to-end smoke testing across all public and protected routes.
- **Security Hardening:** Implemented API rate limiting using `@nestjs/throttler` (`ThrottlerModule`), applying strict rate limits on `/contact` and `/auth/login` to prevent spam and brute-force attacks. Configured `helmet` security middleware to enforce HTTP security headers against XSS, clickjacking, and MIME sniffing.
- **Formal User Acceptance Testing (UAT):** Conducted a formal UAT session on 23 September 2026 with client Bli Dek, Kevin, and the supervisor. Validated project browsing, 3D WebGL spatial cube slot navigation, client inquiry submissions, and admin dashboard updates, securing formal client UAT sign-off.
- **Client Feedback Adjustments & Database Backups:** Refined database records with high-resolution photography and revised architectural project descriptions provided by Bli Dek. Developed an automated SQLite snapshot backup script and validated database disaster recovery procedures.
- **Automated Email Notification Pipeline & Bug Fixing:** Configured the `MailModule` and Nodemailer transporter in `ContactService` to automatically dispatch new inquiry notifications to studio administrators and delivery confirmation receipts to prospective clients. Collaborated with Kevin to resolve table vertical alignment and action button positioning in the admin dashboard catalog view.
- **Formal Client Handover & Project Finalization:** Conducted the official project handover meeting with Bli Dek on 30 September 2026, delivering administrative credentials, system documentation, and receiving enthusiastic client acceptance. Finalized `README.md`, authored the BIT320 Final Report (`FINAL_REPORT_BIT320.md`), and attended the supervisor exit evaluation meeting on 2 October 2026.
- **Weekly Educational Content Creation:** Researched, designed, and published four educational Instagram carousel posts on mobile phone fun facts (display technologies, camera sensors, battery/charging, and mobile processors) every Tuesday, in addition to recording and publishing the monthly educational video for September.

---

### Work to complete next reporting period:

- **Internship Completion:** This represents the third and final monthly progress report, marking the conclusion of the 14-week BIT320 Industrial Internship. All assigned backend engineering deliverables, full-stack integrations, client handover requirements, and academic deliverables have been 100% completed and submitted.
- **Post-Internship Maintenance & Operational Handoff:**
  - Ongoing monitoring of cloud server uptime, memory consumption, and SQLite database storage growth as portfolio projects and client inquiries accumulate over the upcoming quarters.
  - Providing ad-hoc technical advisory during the initial weeks of independent studio operation by GRAHITA Design personnel.
  - Future architectural enhancements: implementing role-based access control (RBAC) if multiple administrative roles are required, and migrating gallery uploads to external cloud object storage (e.g. AWS S3 or Cloudinary) if studio photography exceeds local VPS storage limits.

---

### What is going well and why:

- **Robust Modular Architecture:** The modular Controller-Service-Repository architecture of NestJS and the relational SQLite database designed during earlier weeks provided an exceptionally stable foundation. Adding advanced features—such as JWT route guards, `@nestjs/throttler` rate limiting, `helmet` security headers, and the `MailModule` email pipeline—was seamless and did not destabilize existing modules.
- **Early Staging Deployment & Ample Testing Buffer:** Deploying the backend to the live cloud staging environment early in Week 12 gave the team ample buffer time to conduct smoke tests, preview features with the client, and execute a formal UAT in Week 13 without last-minute deadline pressure.
- **Effective Cross-Functional Collaboration:** Daily coordination with frontend developer Kevin Wiratama remained highly effective. Transitioning from verbal discussions to interactive Swagger/OpenAPI documentation and synchronized Postman collections eliminated API contract discrepancies and accelerated frontend-backend integration.
- **Reliable 3D Spatial Coordination:** The custom `handleCubeIndexConflict` algorithm worked flawlessly during client testing, reliably binding database project records to Three.js 3D WebGL cube meshes without slot collisions.
- **Outstanding Client Satisfaction:** The formal handover meeting with Bli Dek was an overwhelming success. The client was extremely pleased with the modern visual design, bilingual capabilities, and the ease of managing projects autonomously through the secured administrative dashboard.

---

### What is not going well and why:

- **Production Domain vs. Localhost URL Generation:** When moving from local development to production, uploaded image URLs generated in `projects.controller.ts` initially defaulted to localhost rather than the production HTTPS domain. This required dynamically resolving the request protocol and host headers to ensure static assets loaded correctly in production.
- **SMTP Environment Configuration:** Configuring Nodemailer in production initially surfaced warning logs when SMTP environment variables were missing or misconfigured. This was resolved by implementing graceful error handling and fallback console logging in `MailService`, ensuring that contact inquiries still safely persist to the database regardless of mail transport status.
- **Complex Partial Updates on Administrative Endpoints:** Handling updates that combined project text metadata, gallery image arrays, and 3D cube index assignments required meticulous TypeORM entity relationship management. Because child images are cascade-managed, partial updates initially risked detaching existing gallery records, which required implementing explicit image retention tracking (`keepImageIds`).

---

### Suggestions/Issues:

- **Contract-First API Documentation from Day One:** Incorporating automated API documentation tools such as `@nestjs/swagger` from the beginning of a multi-developer project saves significant time during frontend integration by maintaining a single source of truth for request and response structures.
- **Early Staging Environment Setup:** Provisioning a production-like staging environment as early as possible in the project lifecycle allows developers to uncover and resolve environment-specific issues (CORS whitelists, SSL certificates, static file serving permissions) well before client demonstrations.
- **Automated Database Backups as Standard Practice:** Establishing automated timestamped database backups should be implemented as soon as production deployment begins, ensuring complete data recoverability when non-technical client administrators manage live database records.

---

### Changes to internship terms (if applicable - job scope, location, working hours, supervisor):

- **None.** (All internship terms, job scope, workplace location at Code Cipta, working hours, and supervisory arrangements remained fully consistent with the original internship agreement throughout the 14-week placement).

---

**Student's Signature:** `[DIGITAL SIGNATURE / I PUTU AGUS ARIBAWA]`  
**Name:** I Putu Agus Aribawa  
**Date:** 2 October 2026  
