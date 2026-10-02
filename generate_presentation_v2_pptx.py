import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation_v2():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette definitions
    C_BG_DARK = RGBColor(15, 23, 42)        # Deep Slate #0F172A
    C_BG_LIGHT = RGBColor(248, 250, 252)    # Slate 50 #F8FAFC
    C_CARD_WHITE = RGBColor(255, 255, 255)
    C_CARD_DARK = RGBColor(30, 41, 59)      # Slate 800 #1E293B
    C_BORDER_LIGHT = RGBColor(226, 232, 240)# Slate 200 #E2E8F0
    C_BORDER_DARK = RGBColor(51, 65, 85)     # Slate 700 #334155
    C_PRIMARY = RGBColor(2, 132, 199)       # Sky Blue 600 #0284C7
    C_ACCENT_BLUE = RGBColor(14, 165, 233)  # Light Sky #0EA5E9
    C_TEXT_MAIN = RGBColor(15, 23, 42)      # Slate 900
    C_TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500
    C_TEXT_WHITE = RGBColor(255, 255, 255)
    C_TEXT_LIGHT = RGBColor(203, 213, 225)  # Slate 300
    C_GOLD = RGBColor(245, 158, 11)         # Amber Gold #F59E0B
    C_PLACEHOLDER_BG = RGBColor(241, 245, 249) # Slate 100
    C_PLACEHOLDER_BORDER = RGBColor(148, 163, 184) # Slate 400

    def add_header(slide, section_tag, title_text, dark=False):
        # Section pill / tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.0), Inches(0.35))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = section_tag.upper()
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY if not dark else C_ACCENT_BLUE

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.6))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        tf2.margin_left = tf2.margin_top = tf2.margin_right = tf2.margin_bottom = 0
        p2 = tf2.paragraphs[0]
        p2.text = title_text
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = C_TEXT_WHITE if dark else C_TEXT_MAIN

    def add_card(slide, left, top, width, height, bg_color=C_CARD_WHITE, border_color=C_BORDER_LIGHT):
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1)
        else:
            shape.line.fill.background()
        return shape

    def add_placeholder(slide, left, top, width, height, guide_text, code_ref=""):
        # Placeholder container
        card = add_card(slide, left, top, width, height, bg_color=C_PLACEHOLDER_BG, border_color=C_PLACEHOLDER_BORDER)
        
        # Inner text frame for placeholder label
        tf_box = slide.shapes.add_textbox(left, top + Inches(0.18), width, height - Inches(1.5))
        tf = tf_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = "[IMAGE / SCREENSHOT PLACEHOLDER]"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        if code_ref:
            p_ref = tf.add_paragraph()
            p_ref.alignment = PP_ALIGN.CENTER
            p_ref.space_before = Pt(4)
            p_ref.text = f"Source Code: {code_ref}"
            p_ref.font.name = "Consolas"
            p_ref.font.size = Pt(8.5)
            p_ref.font.bold = True
            p_ref.font.color.rgb = RGBColor(30, 41, 59)

        p_sub = tf.add_paragraph()
        p_sub.alignment = PP_ALIGN.CENTER
        p_sub.space_before = Pt(3)
        p_sub.text = "Click or paste your screenshot here"
        p_sub.font.size = Pt(8.5)
        p_sub.font.color.rgb = C_TEXT_MUTED

        # Bottom Caption / Screenshot Guide Box
        guide_box = slide.shapes.add_textbox(left + Inches(0.15), top + height - Inches(1.35), width - Inches(0.3), Inches(1.25))
        tf_g = guide_box.text_frame
        tf_g.word_wrap = True
        tf_g.margin_left = tf_g.margin_top = tf_g.margin_right = tf_g.margin_bottom = 0
        p_gh = tf_g.paragraphs[0]
        p_gh.text = "Screenshot Guide & Code Reference:"
        p_gh.font.size = Pt(8.5)
        p_gh.font.bold = True
        p_gh.font.color.rgb = C_TEXT_MAIN

        p_gt = tf_g.add_paragraph()
        p_gt.space_before = Pt(2)
        p_gt.text = guide_text
        p_gt.font.size = Pt(8)
        p_gt.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG_DARK
    bg1.line.fill.background()

    tag_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.1), Inches(8.5), Inches(0.4))
    tf1_tag = tag_box1.text_frame
    p1_tag = tf1_tag.paragraphs[0]
    p1_tag.text = "HELP UNIVERSITY  |  BIT320 INDUSTRIAL INTERNSHIP FINAL PRESENTATION"
    p1_tag.font.size = Pt(11)
    p1_tag.font.bold = True
    p1_tag.font.color.rgb = C_ACCENT_BLUE

    t_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.8))
    tf1_t = t_box1.text_frame
    tf1_t.word_wrap = True
    p1_t = tf1_t.paragraphs[0]
    p1_t.text = "Development of Scalable Backend Architecture & 3D Spatial Coordination API for GRAHITA Design"
    p1_t.font.size = Pt(32)
    p1_t.font.bold = True
    p1_t.font.color.rgb = C_TEXT_WHITE

    sub_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(3.4), Inches(11.3), Inches(0.6))
    tf1_sub = sub_box1.text_frame
    tf1_sub.word_wrap = True
    p1_sub = tf1_sub.paragraphs[0]
    p1_sub.text = "A Cloud-Deployed NestJS & SQLite RESTful System Integrating 3D WebGL Spatial Portals & Bilingual Localization"
    p1_sub.font.size = Pt(16)
    p1_sub.font.color.rgb = C_TEXT_LIGHT

    card_w = Inches(2.65)
    card_h = Inches(1.9)
    top_pos = Inches(4.5)

    meta_items = [
        ("STUDENT & ROLE", "I Putu Agus Aribawa\nID: E2400080\nBackend Developer Intern", C_ACCENT_BLUE),
        ("HOST ORGANISATION", "Code Cipta\nSoftware House & Development Agency\nLead: Team Supervisor", C_PRIMARY),
        ("CLIENT ORGANISATION", "GRAHITA Design\nSpatial Architecture Studio\nClient Principal: Bli Dek", C_PRIMARY),
        ("EVALUATION & DURATION", "12 Weeks (July – Sept 2026)\nIndustry Score: 94 / 100\nGrade: Excellent", C_GOLD)
    ]

    for idx, (label, val, accent) in enumerate(meta_items):
        cx = Inches(1.0) + idx * Inches(2.85)
        add_card(slide1, cx, top_pos, card_w, card_h, bg_color=C_CARD_DARK, border_color=C_BORDER_DARK)
        c_box = slide1.shapes.add_textbox(cx + Inches(0.18), top_pos + Inches(0.15), card_w - Inches(0.36), card_h - Inches(0.3))
        c_tf = c_box.text_frame
        c_tf.word_wrap = True
        cp1 = c_tf.paragraphs[0]
        cp1.text = label
        cp1.font.size = Pt(9)
        cp1.font.bold = True
        cp1.font.color.rgb = accent

        cp2 = c_tf.add_paragraph()
        cp2.space_before = Pt(6)
        cp2.text = val
        cp2.font.size = Pt(11)
        cp2.font.color.rgb = C_TEXT_WHITE

    slide1.notes_slide.notes_text_frame.text = (
        "Good morning to the respected examiners, supervisor, and lecturers. "
        "I am I Putu Agus Aribawa, Student ID E2400080. Today I am presenting my BIT320 Industrial Internship Final Presentation. "
        "Over the 12-week internship period from July to September 2026, I served as the Backend Developer Intern at Code Cipta, "
        "developing a modern, database-driven spatial architecture platform for our client, GRAHITA Design. "
        "I am pleased to report that the project was completed successfully, deployed to production, and evaluated with an industry score of 94/100 (Grade: Excellent). "
        "Let us begin with the company background."
    )

    # =========================================================================
    # SLIDE 2: COMPANY BACKGROUND
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "01 | ORGANISATIONAL CONTEXT", "Company Background: Host Organisation & Client")

    # Column 1: Code Cipta (Host)
    add_card(slide2, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.5))
    cc_box = slide2.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(5.1))
    cctf = cc_box.text_frame
    cctf.word_wrap = True
    p = cctf.paragraphs[0]
    p.text = "HOST: CODE CIPTA (SOFTWARE HOUSE)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    cc_bullets = [
        ("Company Profile:", "A creative software house and technology development agency specializing in bespoke web platforms, custom cloud architectures, and digital transformation."),
        ("Engineering Environment:", "Operates with cross-functional Agile engineering pods, pairing backend developers, frontend UI/UX engineers, and product leads."),
        ("Internship Mentorship:", "Provided direct engineering supervision, code reviews, and industry exposure to enterprise TypeScript frameworks and deployment pipelines."),
        ("Collaborative Stack:", "Standardized on NestJS for backend robustness, Angular 18 for client interfaces, Git feature branching, and Postman API workspaces.")
    ]
    for h, b in cc_bullets:
        p1 = cctf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = C_TEXT_MAIN

    # Column 2: GRAHITA Design (Client)
    add_card(slide2, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.5))
    gd_box = slide2.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(5.1))
    gdtf = gd_box.text_frame
    gdtf.word_wrap = True
    p = gdtf.paragraphs[0]
    p.text = "CLIENT: GRAHITA DESIGN (SPATIAL STUDIO)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    gd_bullets = [
        ("Studio Identity:", "A premier architecture and spatial design studio known for monolithic concrete structures, fluid boundaries, and sustainable tropical concepts."),
        ("Client Leadership:", "Led by Studio Principal Bli Dek, demanding a digital portfolio that accurately communicates spatial depth rather than flat 2D photography."),
        ("Market & Audience:", "Caters to an international clientele across Southeast Asia and East Asia, requiring full bilingual Chinese (Mandarin) and English capabilities."),
        ("Core Expectation:", "An interactive web platform where physical architectural space translates into interactive 3D WebGL portals with autonomous content management.")
    ]
    for h, b in gd_bullets:
        p1 = gdtf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = C_TEXT_MAIN

    slide2.notes_slide.notes_text_frame.text = (
        "On Slide 2, we present the organizational background. "
        "Code Cipta is a modern software house and development agency that took on the digital transformation of GRAHITA Design. "
        "Code Cipta fosters an Agile engineering culture with peer code reviews and CI/CD best practices. "
        "Our client, GRAHITA Design, is an avant-garde spatial architecture studio led by studio principal Bli Dek. "
        "Because GRAHITA Design serves an international design clientele, their key business demand was an interactive digital presence "
        "with complete bilingual Chinese (Mandarin) and English localization, backed by a robust content management system."
    )

    # =========================================================================
    # SLIDE 3: PROJECT GOALS
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "02 | PROJECT OBJECTIVES", "Project Goals: Bridging Architecture & Web Engineering")

    # Left Box: Problem & Objectives (Width 4.5 in)
    add_card(slide3, Inches(0.8), Inches(1.4), Inches(4.5), Inches(5.5))
    pg_box = slide3.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(4.1), Inches(5.2))
    pgtf = pg_box.text_frame
    pgtf.word_wrap = True

    p = pgtf.paragraphs[0]
    p.text = "TRANSFORMATION CHALLENGE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    pg_bullets = [
        ("Legacy Static Bottleneck:", "Previous portfolio was static HTML with hardcoded text and images. Every update required manual developer intervention."),
        ("Absence of Centralized CMS:", "No administrative authentication or database management existed to update project catalogs or monitor client inquiries."),
        ("Missing Spatial Identity:", "The digital presentation failed to convey the 3D spatial volumetric aesthetics that define GRAHITA Design's physical architecture.")
    ]
    for h, b in pg_bullets:
        p1 = pgtf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = C_TEXT_MAIN

    # Right Box: 5 Key Technical Deliverables (Width 6.9 in)
    delivs = [
        ("1. Relational Portfolio Management:", "Design an SQLite relational schema via TypeORM supporting categories, rich architectural metadata, and multi-image galleries."),
        ("2. Bilingual Content Synchronization:", "Engineer database entities and DTOs with Chinese (Mandarin) and English field parity (title, description, specs)."),
        ("3. 3D WebGL Spatial Coordination:", "Author an algorithmic slot coordination mechanism (handleCubeIndexConflict) mapping database projects to 55 Three.js 3D cubes."),
        ("4. Automated Two-Way Inquiry Pipeline:", "Build validated POST /contact endpoint with asynchronous dual Nodemailer SMTP dispatch (admin alert & client confirmation)."),
        ("5. Secured Administrative Dashboard:", "Implement JWT token authentication with bcrypt password hashing and route guards for autonomous studio CMS management.")
    ]

    for idx, (title, desc) in enumerate(delivs):
        dy = Inches(1.4) + idx * Inches(1.08)
        add_card(slide3, Inches(5.6), dy, Inches(6.9), Inches(0.98))
        
        dbox = slide3.shapes.add_textbox(Inches(5.8), dy + Inches(0.1), Inches(6.5), Inches(0.78))
        dtf = dbox.text_frame
        dtf.word_wrap = True
        dp1 = dtf.paragraphs[0]
        dp1.text = title
        dp1.font.size = Pt(10.5)
        dp1.font.bold = True
        dp1.font.color.rgb = C_PRIMARY

        dp2 = dtf.add_paragraph()
        dp2.space_before = Pt(2)
        dp2.text = desc
        dp2.font.size = Pt(9)
        dp2.font.color.rgb = C_TEXT_MUTED

    slide3.notes_slide.notes_text_frame.text = (
        "On Slide 3, we establish the project goals. "
        "GRAHITA Design needed to break free from a static HTML website that incurred operational delays every time a new project completed. "
        "Our team set five clear architectural deliverables: "
        "first, a relational portfolio schema; second, native bilingual Chinese and English localization; "
        "third, mathematical 3D cube slot coordination for Three.js; fourth, an automated two-way email notification pipeline; "
        "and fifth, a secured administrative dashboard with JWT guards. "
        "As backend developer, my duty was to ensure these five pillars operated with high reliability and sub-millisecond query performance."
    )

    # =========================================================================
    # SLIDE 4: PROJECT OUTCOMES (1/4): 3D SPATIAL CANVAS & WEBGL SYNC
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "03 | PROJECT OUTCOMES (1/4)", "Outcome 1: Interactive 3D Spatial Canvas & WebGL Sync")

    # Left Column: Technical Achievements (Width 5.5 in)
    add_card(slide4, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    o1_box = slide4.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    o1tf = o1_box.text_frame
    o1tf.word_wrap = True
    p = o1tf.paragraphs[0]
    p.text = "3D SPATIAL COORDINATION OUTCOMES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    o1_bullets = [
        ("Three.js 55-Cube Spatial Matrix:", "The frontend renders 55 interactive wireframe cubes distributed across 3D coordinate space on the Home/Manifestation page."),
        ("Raycasting Collision Detection:", "Mouse hover events dynamically cast ray vectors into the WebGL scene, identifying active cubes and pulling bound project metadata."),
        ("The handleCubeIndexConflict Algorithm:", "Authored in ProjectsService using TypeORM's Not(currentProjectId) to atomically eject prior slot occupants (setting cubeIndex = null), guaranteeing zero collision."),
        ("Glassmorphic Hover Tooltips:", "Interactive UI renders bilingual project title, category, and spatial index, providing seamless click routing to project details."),
        ("Performance Result:", "Sub-50ms latency for GET /projects/pane-status, ensuring instantaneous 3D scene initialization.")
    ]
    for h, b in o1_bullets:
        p1 = o1tf.add_paragraph()
        p1.space_before = Pt(7)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.2)
        p1.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in) with EXACT CODE REFERENCE
    add_placeholder(
        slide4,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Capture the public Home/Manifestation page showing the interactive Three.js 3D cube matrix with a cube hovered "
        "(showing title & tooltip). Code ref: projects.service.ts (handleCubeIndexConflict) and cube-field.component.ts (Raycaster collision).",
        code_ref="backend/src/projects/projects.service.ts (Lines 111-131)"
    )

    slide4.notes_slide.notes_text_frame.text = (
        "Slide 4 showcases our first major outcome: the 3D spatial WebGL canvas. "
        "Rather than a conventional flat grid, GRAHITA Design's homepage features 55 interactive 3D cubes created with Three.js by Kevin Wiratama. "
        "My backend powers this through the 'handleCubeIndexConflict' algorithm: whenever a project is assigned a cubeIndex (0 to 54), "
        "the backend ensures no two projects ever claim the same slot. "
        "The endpoint /projects/pane-status responds in under 50 milliseconds, allowing Three.js to bind database projects "
        "to interactive WebGL meshes seamlessly with glassmorphic tooltips."
    )

    # =========================================================================
    # SLIDE 5: PROJECT OUTCOMES (2/4): BILINGUAL PORTFOLIO CATALOG
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "03 | PROJECT OUTCOMES (2/4)", "Outcome 2: Bilingual Architectural Portfolio & Showcase")

    # Left Column: Technical Achievements (Width 5.5 in)
    add_card(slide5, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    o2_box = slide5.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    o2tf = o2_box.text_frame
    o2tf.word_wrap = True
    p = o2tf.paragraphs[0]
    p.text = "BILINGUAL CATALOG & QUERY CAPABILITIES"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    o2_bullets = [
        ("Bilingual Entity Architecture:", "Restructured Project and Category entities with dedicated Chinese (Mandarin) and English columns (title, category, location, description)."),
        ("Dynamic Language Switcher:", "Endpoints accept ?lang=zh or ?lang=en query parameters, returning standardized JSON payloads tailored to the client's language toggle."),
        ("Multi-Image Gallery Association:", "Projects link to ProjectImage records via @OneToMany with cascading deletion, allowing multi-perspective architectural photo galleries."),
        ("Category Filtering & Pagination:", "GET /projects supports category filtering (Residential, Commercial, Cultural, Institutional) and pagination via TypeORM skip/take."),
        ("Automated Seeder Initialization:", "OnModuleInit automatically seeds 5 realistic architectural projects with complete bilingual copy and image arrays upon startup.")
    ]
    for h, b in o2_bullets:
        p1 = o2tf.add_paragraph()
        p1.space_before = Pt(7)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.2)
        p1.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in) with EXACT CODE REFERENCE
    add_placeholder(
        slide5,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Capture the public Portfolio page or Project Detail view demonstrating bilingual content rendering (Chinese/English text) "
        "and multi-image gallery. Code ref: project.entity.ts (title, description, cubeIndex, images @OneToMany) and projects.service.ts (onModuleInit seeder).",
        code_ref="backend/src/projects/project.entity.ts (Lines 1-32)"
    )

    slide5.notes_slide.notes_text_frame.text = (
        "Slide 5 illustrates our second outcome: the bilingual portfolio catalog. "
        "To serve GRAHITA Design's target market across East and Southeast Asia, I engineered complete bilingual support into our TypeORM entities. "
        "The API dynamically resolves requests for Chinese (Mandarin) and English content. "
        "Furthermore, our multi-image gallery relationship allows each architectural project to showcase multiple high-resolution photos with cover image synchronization. "
        "Category filtering and pagination were validated through Postman, ensuring fast page rendering."
    )

    # =========================================================================
    # SLIDE 6: PROJECT OUTCOMES (3/4): SECURED ADMIN CMS DASHBOARD
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "03 | PROJECT OUTCOMES (3/4)", "Outcome 3: Secured Admin Content Management Dashboard")

    # Left Column: Technical Achievements (Width 5.5 in)
    add_card(slide6, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    o3_box = slide6.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    o3tf = o3_box.text_frame
    o3tf.word_wrap = True
    p = o3tf.paragraphs[0]
    p.text = "ADMINISTRATIVE CMS SPECIFICATIONS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    o3_bullets = [
        ("Authentication & Access Control:", "POST /auth/login verifies salted bcrypt password hashes and issues signed JSON Web Tokens (JWT) with 7-day expiration."),
        ("Protected Mutation Routes:", "JwtAuthGuard enforces Bearer token validation across POST /projects, PUT /projects/:id, and DELETE /projects/:id."),
        ("Multi-Image File Upload Pipeline:", "Configured Multer's FilesInterceptor with diskStorage in ProjectsController, storing uploaded photos in ./uploads/ with unique timestamped filenames."),
        ("Granular Image Management:", "Implemented DELETE /projects/:id/images/:imageId with automatic disk cleanup (fs.unlinkSync) to prevent orphaned storage leaks."),
        ("Client Autonomy:", "Studio staff can log into /admin/dashboard, upload new projects, update bilingual descriptions, and assign 3D cube slots without developer help.")
    ]
    for h, b in o3_bullets:
        p1 = o3tf.add_paragraph()
        p1.space_before = Pt(7)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.2)
        p1.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in) with EXACT CODE REFERENCE
    add_placeholder(
        slide6,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Capture the Admin Dashboard (/admin/dashboard) showing the catalog table, image upload dropzone, and cube index selector. "
        "Code ref: projects.controller.ts (FilesInterceptor, Multer diskStorage, JwtAuthGuard) and projects.service.ts (deleteFileByUrl fs.unlinkSync).",
        code_ref="backend/src/projects/projects.controller.ts (Lines 55-151)"
    )

    slide6.notes_slide.notes_text_frame.text = (
        "On Slide 6, we present our third outcome: the administrative CMS dashboard. "
        "A critical project goal was empowering GRAHITA Design to manage their portfolio independently. "
        "I built the administrative security layer using Passport.js and JWT tokens. "
        "All create, update, and delete endpoints are guarded by JwtAuthGuard. "
        "Using Multer disk storage, administrators can upload multiple photos at once. "
        "I also built physical filesystem cleanup routines: deleting a project or image immediately unlinks the file from disk, "
        "preventing storage leaks on the production server."
    )

    # =========================================================================
    # SLIDE 7: PROJECT OUTCOMES (4/4): BACKEND API, SWAGGER & SMTP PIPELINE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "03 | PROJECT OUTCOMES (4/4)", "Outcome 4: Backend API, Swagger Docs & Dual SMTP Mailer")

    # Left Column: Technical Achievements (Width 5.5 in)
    add_card(slide7, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    o4_box = slide7.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    o4tf = o4_box.text_frame
    o4tf.word_wrap = True
    p = o4tf.paragraphs[0]
    p.text = "API DOCUMENTATION & EMAIL PIPELINE"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    o4_bullets = [
        ("Interactive Swagger OpenAPI (/api/docs):", "Integrated @nestjs/swagger with full DTO schemas and HTTP response definitions, providing a live interactive contract for frontend consumption."),
        ("Asynchronous Dual Nodemailer Dispatch:", "MailModule dispatches two emails upon each contact form submission:"),
        ("  • Studio Admin Notification:", "Sends complete client inquiry to studio admin (gusari2271@gmail.com) with replyTo configured to client's email."),
        ("  • Client Delivery Confirmation:", "Sends an immediate automated receipt confirmation to the prospective client."),
        ("Graceful Simulation Mode:", "Fallback console logging ensures local developer testing never breaks if SMTP credentials are not yet populated in .env."),
        ("Production Cloud Deployment:", "Deployed with PM2 process manager and Nginx reverse proxy on cloud hosting with production CORS whitelisting.")
    ]
    for h, b in o4_bullets:
        p1 = o4tf.add_paragraph()
        p1.space_before = Pt(6)
        p1.text = ("• " + h + " " + b) if not h.startswith("  •") else ("   " + h.strip() + " " + b)
        p1.font.size = Pt(9.2)
        p1.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in) with EXACT CODE REFERENCE
    add_placeholder(
        slide7,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Capture the Swagger UI docs (/api/docs) or Postman testing collection, and test inquiry emails in the inbox/terminal log. "
        "Code ref: contact.service.ts (sendContactInquiryNotification, sendContactFormConfirmation) and app.module.ts (ThrottlerModule, TypeOrmModule).",
        code_ref="backend/src/contact/contact.service.ts (Lines 18-43)"
    )

    slide7.notes_slide.notes_text_frame.text = (
        "Slide 7 covers the fourth outcome: our API documentation and automated communication pipeline. "
        "To ensure seamless collaboration with frontend developer Kevin, I set up Swagger OpenAPI at /api/docs, providing living, interactive documentation. "
        "For client inquiries, I implemented a dual-dispatch email service using Nodemailer: "
        "the studio receives the inquiry with reply-to headers pointing to the client, and the client receives an automated confirmation receipt. "
        "I also added a simulation mode so that missing SMTP credentials in local testing gracefully log to console rather than throwing errors. "
        "The backend is fully deployed in production using PM2 and Nginx."
    )

    # =========================================================================
    # SLIDE 8: INTERNSHIP GOALS AND OUTCOMES (1/2): TECHNICAL DELIVERABLES
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "04 | INTERNSHIP GOALS & OUTCOMES (1/2)", "Internship Goals & Technical Deliverables Alignment")

    cols_data = [
        (
            "INITIAL INTERNSHIP GOALS",
            [
                "Master NestJS modular enterprise architecture and TypeScript dependency injection.",
                "Design normalized SQLite relational schema and implement TypeORM repository operations.",
                "Build secure authentication pipeline using Passport JWT and route guards.",
                "Implement robust file upload handling and dynamic static asset serving."
            ],
            C_PRIMARY
        ),
        (
            "ACTUAL TECHNICAL OUTCOMES",
            [
                "100% of planned endpoints built, tested in Postman, and deployed to production.",
                "Engineered Project, ProjectImage, Contact, and User entities with cascading relationships.",
                "Implemented JwtAuthGuard protecting administrative mutation routes with bcrypt hashing.",
                "Integrated Multer multi-file uploads with physical disk cleanup routines (fs.unlinkSync)."
            ],
            C_ACCENT_BLUE
        ),
        (
            "EXCEEDED SCOPE DELIVERABLES",
            [
                "Authored custom handleCubeIndexConflict algorithm for 3D Three.js WebGL slot coordination.",
                "Built asynchronous dual Nodemailer SMTP dispatch with simulation fallback.",
                "Implemented ThrottlerModule API rate limiting and helmet security headers.",
                "Constructed full-stack monorepo launch workflow via 'concurrently'."
            ],
            C_GOLD
        )
    ]

    for idx, (head, points, accent) in enumerate(cols_data):
        cx = Inches(0.8) + idx * Inches(4.0)
        add_card(slide8, cx, Inches(1.4), Inches(3.7), Inches(5.5))
        
        box = slide8.shapes.add_textbox(cx + Inches(0.18), Inches(1.6), Inches(3.34), Inches(5.1))
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = accent

        for pt in points:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(8)
            p_b.text = "• " + pt
            p_b.font.size = Pt(9.2)
            p_b.font.color.rgb = C_TEXT_MAIN

    slide8.notes_slide.notes_text_frame.text = (
        "On Slide 8, we evaluate my personal internship goals against actual technical deliveries. "
        "At the start of the internship, my goals focused on mastering NestJS, learning TypeORM repository patterns, and implementing JWT auth. "
        "I achieved 100% of these baseline goals. "
        "Furthermore, I took the initiative to exceed the initial scope: "
        "I engineered the 3D cube conflict algorithm, implemented dual Nodemailer email automation, added rate limiting, and unified our monorepo developer scripts. "
        "This demonstrated proactive problem-solving and architectural initiative beyond minimum course requirements."
    )

    # =========================================================================
    # SLIDE 9: INTERNSHIP GOALS AND OUTCOMES (2/2): INDUSTRY EVALUATION
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "04 | INTERNSHIP GOALS & OUTCOMES (2/2)", "Internship Outcomes: 94/100 Industry Evaluation")

    add_card(slide9, Inches(0.8), Inches(1.4), Inches(4.5), Inches(5.5), bg_color=C_CARD_DARK)
    score_box = slide9.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.1), Inches(5.1))
    stf = score_box.text_frame
    stf.word_wrap = True

    p = stf.paragraphs[0]
    p.text = "INDUSTRY EVALUATION"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_ACCENT_BLUE

    p_sc = stf.add_paragraph()
    p_sc.space_before = Pt(10)
    p_sc.text = "94 / 100"
    p_sc.font.size = Pt(44)
    p_sc.font.bold = True
    p_sc.font.color.rgb = C_GOLD

    p_gr = stf.add_paragraph()
    p_gr.text = "GRADE: EXCELLENT"
    p_gr.font.size = Pt(14)
    p_gr.font.bold = True
    p_gr.font.color.rgb = C_TEXT_WHITE

    p_comm = stf.add_paragraph()
    p_comm.space_before = Pt(14)
    p_comm.text = (
        "Supervisor Feedback (Code Cipta):\n"
        '"Agus demonstrated outstanding technical growth and initiative. He engineered the backend architecture with high quality, '
        'actively solved complex relational and spatial challenges, and maintained exceptional professional teamwork throughout the placement."'
    )
    p_comm.font.size = Pt(9.5)
    p_comm.font.italic = True
    p_comm.font.color.rgb = C_TEXT_LIGHT

    milestones = [
        ("Weeks 1 – 4 | Planning & Schema Locking", "Requirement gathering with Bli Dek, PRD/TRD authoring, SQLite schema locking, and NestJS scaffolding."),
        ("Weeks 6 – 9 | Core Modules & Bilingual Rework", "Projects CRUD, Contact Inquiries with class-validator, and bilingual Chinese/English entity refactoring."),
        ("Weeks 10 – 12 | Auth & Production Deployment", "Passport JWT authentication, JwtAuthGuard, production PM2/Nginx hosting setup, and Angular integration."),
        ("Weeks 13 – 14 | UAT, Handover & Deliverables", "Formal client UAT sign-off with Bli Dek, automated backups, project handover on 30 Sept, and final report completion.")
    ]

    for idx, (title, desc) in enumerate(milestones):
        dy = Inches(1.4) + idx * Inches(1.36)
        add_card(slide9, Inches(5.6), dy, Inches(6.9), Inches(1.24))
        
        mbox = slide9.shapes.add_textbox(Inches(5.8), dy + Inches(0.12), Inches(6.5), Inches(1.0))
        mtf = mbox.text_frame
        mtf.word_wrap = True
        mp1 = mtf.paragraphs[0]
        mp1.text = title
        mp1.font.size = Pt(11)
        mp1.font.bold = True
        mp1.font.color.rgb = C_PRIMARY

        mp2 = mtf.add_paragraph()
        mp2.space_before = Pt(4)
        mp2.text = desc
        mp2.font.size = Pt(9.2)
        mp2.font.color.rgb = C_TEXT_MAIN

    slide9.notes_slide.notes_text_frame.text = (
        "Slide 9 highlights the formal evaluation outcomes. "
        "At the conclusion of the 12-week placement, my workplace supervisor at Code Cipta awarded me an industry evaluation score of 94 out of 100, "
        "which corresponds to an 'Excellent' rating. "
        "The supervisor commended my technical initiative in independently solving the 3D cube conflict problem, "
        "as well as my reliable communication. "
        "On the right side, the timeline illustrates our progression from early Waterfall schema planning to the successful client handover with Bli Dek on September 30th."
    )

    # =========================================================================
    # SLIDE 10: EXPERIENCE GAINED
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "05 | PROFESSIONAL REFLECTION", "Experience Gained: Academic Learning vs. Industry Reality")

    exp_cards = [
        (
            "1. RELATIONAL ORM IN PRODUCTION",
            "In university, database assignments focus on writing raw SQL queries on static test tables. "
            "In this internship, I learned how enterprise ORMs (TypeORM) manage entity state lifecycles, cascading child associations, "
            "and transactional queries, while synchronizing relational state with physical files stored on the server's disk.",
            Inches(0.8), Inches(1.4)
        ),
        (
            "2. MODULAR ARCHITECTURE & DI",
            "Classroom coding often consists of monolithic scripts. At Code Cipta, I mastered NestJS's opinionated dependency injection container, "
            "modular providers, and custom decorators, learning how decoupled architectures make enterprise code testable, maintainable, and scalable.",
            Inches(6.8), Inches(1.4)
        ),
        (
            "3. ENTERPRISE SECURITY & HEADERS",
            "I gained hands-on experience implementing multi-tiered security: configuring CORS whitelists for Angular, "
            "enforcing class-validator DTO sanitization, hashing passwords with salted bcrypt rounds, and applying helmet HTTP security headers.",
            Inches(0.8), Inches(4.2)
        ),
        (
            "4. CLOUD DEPLOYMENT & OPERATIONS",
            "Moving beyond localhost:3000, I learned how to prepare production configurations (.env.production), "
            "set up PM2 process management with automatic reboot recovery, configure Nginx reverse proxies, and handle live HTTPS domain URL resolution.",
            Inches(6.8), Inches(4.2)
        )
    ]

    for title, desc, left, top in exp_cards:
        add_card(slide10, left, top, Inches(5.7), Inches(2.65))
        box = slide10.shapes.add_textbox(left + Inches(0.2), top + Inches(0.18), Inches(5.3), Inches(2.3))
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        p2 = tf.add_paragraph()
        p2.space_before = Pt(6)
        p2.text = desc
        p2.font.size = Pt(9.2)
        p2.font.color.rgb = C_TEXT_MAIN

    slide10.notes_slide.notes_text_frame.text = (
        "Slide 10 reflects on the technical experience gained. "
        "The internship bridged academic coursework with real-world industry engineering. "
        "In university, we learn relational algebra and basic SQL. In production, I learned how ORMs manage entity cascades and disk cleanup. "
        "I gained deep practical mastery in NestJS dependency injection, industry-standard JWT authentication, CORS preflight debugging, "
        "and cloud hosting operations with PM2 and Nginx. "
        "These experiences transformed my understanding from writing functional scripts to architecting production-grade server systems."
    )

    # =========================================================================
    # SLIDE 11: LESSONS LEARNED
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "06 | CRITICAL INSIGHTS", "Lessons Learned: Problem Solving & Engineering Best Practices")

    lessons_data = [
        (
            "1. TEST COMBINED EDGE CASES EARLY",
            [
                "During late Admin Dashboard testing, an intermittent error appeared when updating text and replacing gallery images in one request.",
                "Key Insight: Individual CRUD tests pass easily, but multi-field combination updates reveal subtle ORM cascade detachment bugs.",
                "Takeaway: Schedule combined-field and edge-case integration tests earlier in sprint cycles rather than in final acceptance testing."
            ],
            C_PRIMARY
        ),
        (
            "2. LIVING API CONTRACTS (SWAGGER)",
            [
                "Early informal verbal agreements with the frontend developer caused minor payload mismatches (e.g. image array naming conventions).",
                "Key Insight: Verbal alignment quickly drifts during rapid iterations.",
                "Takeaway: Integrate Swagger OpenAPI (@nestjs/swagger) and synchronized Postman collections from Day 1 to maintain an authoritative single source of truth."
            ],
            C_GOLD
        ),
        (
            "3. DEFENSIVE DESIGN & AUTOMATED SAFETY",
            [
                "External services and runtime environments often behave unpredictably (e.g. missing SMTP credentials on local dev machines).",
                "Key Insight: Systems must be designed to degrade gracefully without breaking primary database transactions.",
                "Takeaway: Build simulation fallbacks and establish automated database backup scripts before handing administrative access to clients."
            ],
            C_ACCENT_BLUE
        )
    ]

    for idx, (head, points, accent) in enumerate(lessons_data):
        cx = Inches(0.8) + idx * Inches(4.0)
        add_card(slide11, cx, Inches(1.4), Inches(3.7), Inches(5.5))
        
        box = slide11.shapes.add_textbox(cx + Inches(0.18), Inches(1.6), Inches(3.34), Inches(5.1))
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = accent

        for pt in points:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(8)
            p_b.text = "• " + pt
            p_b.font.size = Pt(9.2)
            p_b.font.color.rgb = C_TEXT_MAIN

    slide11.notes_slide.notes_text_frame.text = (
        "Slide 11 examines the key lessons learned. "
        "First, I learned the importance of testing combined edge cases early. "
        "The intermittent admin gallery update issue only surfaced when modifying text and uploading photos in the same request; "
        "isolating it taught me that integration testing must test complex composite payloads early in development. "
        "Second, contract-first design is indispensable: using Swagger and Postman eliminated communication drift between Kevin and myself. "
        "Third, defensive engineering—such as simulation fallback for our mailer and automated SQLite backups—ensures production resilience."
    )

    # =========================================================================
    # SLIDE 12: COMMUNICATION & TEAM COLLABORATION
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "07 | STAKEHOLDER COLLABORATION", "Communication: Team Interactions & Interpersonal Dynamics")

    comm_cards = [
        (
            "PEER COLLABORATION (FRONTEND)",
            "Collaborated daily with Kevin Wiratama (Frontend Developer) via Discord and GitHub pull requests. "
            "We established written API contracts in Postman, aligned CORS preflight policies, and resolved image upload boundaries. "
            "Pairing directly on Three.js WebGL data binding ensured our backend cubeIndex mapped perfectly to the 3D raycaster.",
            Inches(0.8), Inches(1.4)
        ),
        (
            "SUPERVISOR MENTORSHIP & REVIEWS",
            "Participated in weekly sprint reviews with my supervisor at Code Cipta. "
            "Presented live API demonstrations, discussed schema decisions, and incorporated feedback on code cleanliness and migration safety. "
            "Practiced active listening and transparent defect reporting, which built trust and earned an 'Excellent' evaluation.",
            Inches(0.8), Inches(3.6)
        ),
        (
            "CLIENT ENGAGEMENT (BLI DEK)",
            "Engaged in bi-weekly milestone reviews and the formal UAT session with GRAHITA Design's studio principal, Bli Dek. "
            "Translated architectural requirements into data structures, adapted to the mid-project bilingual Chinese/English request, "
            "and executed a smooth handover on 30 September 2026, delivering administrative credentials and user guides.",
            Inches(6.8), Inches(1.4)
        ),
        (
            "THE VITAL IMPORTANCE OF COMMUNICATION",
            "Technical skill alone cannot deliver software. Proactive communication, written contracts, and transparent status updates "
            "prevented scope misunderstandings and integration bottlenecks. Effective cross-functional collaboration was the single most "
            "critical factor in delivering a production-ready spatial platform on schedule.",
            Inches(6.8), Inches(3.6)
        )
    ]

    for title, desc, left, top in comm_cards:
        add_card(slide12, left, top, Inches(5.7), Inches(2.05))
        box = slide12.shapes.add_textbox(left + Inches(0.2), top + Inches(0.12), Inches(5.3), Inches(1.8))
        tf = box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        p2 = tf.add_paragraph()
        p2.space_before = Pt(4)
        p2.text = desc
        p2.font.size = Pt(9)
        p2.font.color.rgb = C_TEXT_MAIN

    # Bottom Q&A Banner
    add_card(slide12, Inches(0.8), Inches(5.95), Inches(11.7), Inches(0.95), bg_color=C_BG_DARK)
    qa_box = slide12.shapes.add_textbox(Inches(1.0), Inches(6.05), Inches(11.3), Inches(0.75))
    qatf = qa_box.text_frame
    qatf.word_wrap = True
    qp = qatf.paragraphs[0]
    qp.alignment = PP_ALIGN.CENTER
    qp.text = "THANK YOU FOR YOUR TIME & ATTENTION  |  OPEN FOR QUESTIONS & ANSWERS (Q&A)"
    qp.font.size = Pt(11)
    qp.font.bold = True
    qp.font.color.rgb = C_ACCENT_BLUE

    qp_sub = qatf.add_paragraph()
    qp_sub.alignment = PP_ALIGN.CENTER
    qp_sub.text = "I Putu Agus Aribawa  |  Student ID: E2400080  |  BIT320 Industrial Internship  |  Code Cipta & GRAHITA Design"
    qp_sub.font.size = Pt(9)
    qp_sub.font.color.rgb = C_TEXT_LIGHT

    slide12.notes_slide.notes_text_frame.text = (
        "In our final slide on Slide 12, we highlight communication and interpersonal teamwork. "
        "A successful software project relies on clear human collaboration as much as code. "
        "Working with Kevin on the Angular frontend taught me the power of written API contracts and collaborative debugging. "
        "Weekly supervisor reviews sharpened my ability to present technical solutions and receive constructive criticism. "
        "Engaging directly with our client, Bli Dek, developed my professional communication skills, translating business needs into data schemas. "
        "This concludes my internship presentation. I would like to express my sincere gratitude to my supervisor at Code Cipta, "
        "my lecturers at HELP University, and my colleague Kevin. Thank you very much, and I welcome any questions."
    )

    out_path = "c:\\Users\\LENOVO\\Downloads\\CLONE GRAHITA\\Internship\\final_presentation_internship_v2_with_code_references.pptx"
    prs.save(out_path)
    print(f"Successfully generated PowerPoint presentation v2 (with code references): {out_path}")
    
    # Also attempt to save to default name if not locked
    try:
        default_path = "c:\\Users\\LENOVO\\Downloads\\CLONE GRAHITA\\Internship\\final_presentation_internship_v2.pptx"
        prs.save(default_path)
        print(f"Successfully updated: {default_path}")
    except PermissionError:
        print("Note: final_presentation_internship_v2.pptx is currently open in PowerPoint. Saved to final_presentation_internship_v2_with_code_references.pptx!")

if __name__ == "__main__":
    create_presentation_v2()
