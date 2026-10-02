import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette definitions
    C_BG_DARK = RGBColor(15, 23, 42)      # Deep Slate #0F172A
    C_BG_LIGHT = RGBColor(248, 250, 252)  # Slate 50 #F8FAFC
    C_CARD_WHITE = RGBColor(255, 255, 255)
    C_CARD_DARK = RGBColor(30, 41, 59)    # Slate 800 #1E293B
    C_BORDER_LIGHT = RGBColor(226, 232, 240) # Slate 200 #E2E8F0
    C_BORDER_DARK = RGBColor(51, 65, 85)   # Slate 700 #334155
    C_PRIMARY = RGBColor(2, 132, 199)     # Sky Blue 600 #0284C7
    C_ACCENT_BLUE = RGBColor(14, 165, 233)# Light Sky #0EA5E9
    C_TEXT_MAIN = RGBColor(15, 23, 42)    # Slate 900
    C_TEXT_MUTED = RGBColor(100, 116, 139)# Slate 500
    C_TEXT_WHITE = RGBColor(255, 255, 255)
    C_TEXT_LIGHT = RGBColor(203, 213, 225)# Slate 300
    C_GOLD = RGBColor(245, 158, 11)       # Amber Gold #F59E0B
    C_CODE_BG = RGBColor(15, 23, 42)
    C_PLACEHOLDER_BG = RGBColor(241, 245, 249) # Slate 100
    C_PLACEHOLDER_BORDER = RGBColor(148, 163, 184) # Slate 400

    def add_header(slide, section_tag, title_text, dark=False):
        # Section pill / tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8.0), Inches(0.35))
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

    def add_placeholder(slide, left, top, width, height, guide_text):
        # Placeholder container
        card = add_card(slide, left, top, width, height, bg_color=C_PLACEHOLDER_BG, border_color=C_PLACEHOLDER_BORDER)
        
        # Inner text frame for placeholder label
        tf_box = slide.shapes.add_textbox(left, top + Inches(0.2), width, height - Inches(1.3))
        tf = tf_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = "[IMAGE / SCREENSHOT PLACEHOLDER]"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        p_sub = tf.add_paragraph()
        p_sub.alignment = PP_ALIGN.CENTER
        p_sub.text = "Click to attach presentation image"
        p_sub.font.size = Pt(9.5)
        p_sub.font.color.rgb = C_TEXT_MUTED

        # Bottom Caption / Screenshot Guide Box
        guide_box = slide.shapes.add_textbox(left + Inches(0.15), top + height - Inches(1.15), width - Inches(0.3), Inches(1.05))
        tf_g = guide_box.text_frame
        tf_g.word_wrap = True
        tf_g.margin_left = tf_g.margin_top = tf_g.margin_right = tf_g.margin_bottom = 0
        p_gh = tf_g.paragraphs[0]
        p_gh.text = "Screenshot Guide & Description:"
        p_gh.font.size = Pt(8.5)
        p_gh.font.bold = True
        p_gh.font.color.rgb = C_TEXT_MAIN

        p_gt = tf_g.add_paragraph()
        p_gt.text = guide_text
        p_gt.font.size = Pt(8)
        p_gt.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Dark Executive Theme)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG_DARK
    bg1.line.fill.background()

    # Top Tag
    tag_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.1), Inches(8.0), Inches(0.4))
    tf1_tag = tag_box1.text_frame
    p1_tag = tf1_tag.paragraphs[0]
    p1_tag.text = "HELP UNIVERSITY  |  BIT320 INDUSTRIAL INTERNSHIP FINAL DEFENSE"
    p1_tag.font.size = Pt(11)
    p1_tag.font.bold = True
    p1_tag.font.color.rgb = C_ACCENT_BLUE

    # Main Title
    t_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.3), Inches(1.8))
    tf1_t = t_box1.text_frame
    tf1_t.word_wrap = True
    p1_t = tf1_t.paragraphs[0]
    p1_t.text = "Development of Scalable Backend Architecture & 3D Spatial Coordination API for GRAHITA Design"
    p1_t.font.size = Pt(32)
    p1_t.font.bold = True
    p1_t.font.color.rgb = C_TEXT_WHITE

    # Subtitle
    sub_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(3.4), Inches(11.3), Inches(0.6))
    tf1_sub = sub_box1.text_frame
    tf1_sub.word_wrap = True
    p1_sub = tf1_sub.paragraphs[0]
    p1_sub.text = "A Cloud-Deployed NestJS & SQLite RESTful System Integrating 3D WebGL Spatial Portals & Bilingual Localization"
    p1_sub.font.size = Pt(16)
    p1_sub.font.color.rgb = C_TEXT_LIGHT

    # Metadata Cards Grid (4 Cards in a row)
    card_w = Inches(2.65)
    card_h = Inches(1.9)
    top_pos = Inches(4.5)

    meta_items = [
        ("STUDENT & ROLE", "I Putu Agus Aribawa\nID: E2400080\nBackend Developer Intern", C_ACCENT_BLUE),
        ("HOST ORGANISATION", "Code Cipta\nSoftware House & Digital Agency\nLead: Team Supervisor", C_PRIMARY),
        ("CLIENT ORGANISATION", "GRAHITA Design\nSpatial Architecture Studio\nClient Principal: Bli Dek", C_PRIMARY),
        ("EVALUATION & DURATION", "12 Weeks (July – Sept 2026)\nIndustry Score: 94 / 100\nGrade: Excellent", C_GOLD)
    ]

    for idx, (label, val, accent) in enumerate(meta_items):
        cx = Inches(1.0) + idx * Inches(2.85)
        add_card(slide1, cx, top_pos, card_w, card_h, bg_color=C_CARD_DARK, border_color=C_BORDER_DARK)
        
        # Content in card
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
        "I am I Putu Agus Aribawa, Student ID E2400080. Today I am proud to present my Final Internship Defense for BIT320 "
        "Industrial Internship. Over the past 12 weeks from July to September 2026, I worked as a Backend Developer Intern at Code Cipta, "
        "where I independently designed, built, and deployed the complete backend infrastructure for our client, GRAHITA Design—a spatial "
        "architecture studio. The platform successfully bridges modern NestJS server architecture with an interactive Three.js 3D WebGL "
        "spatial canvas and full bilingual Chinese and English content localization. I received an industry evaluation score of 94 out of 100 "
        "(Grade: Excellent) from my supervisor at Code Cipta. Let us begin with the project background."
    )

    # =========================================================================
    # SLIDE 2: PROJECT BACKGROUND & DELIVERABLES
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "01 | PROJECT CONTEXT & SCOPE", "Project Background & 5 Core Deliverables")

    # Left Column: Problem & Target (Width 4.4 in)
    add_card(slide2, Inches(0.8), Inches(1.4), Inches(4.3), Inches(2.55))
    pb_box = slide2.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(3.9), Inches(2.2))
    pbtf = pb_box.text_frame
    pbtf.word_wrap = True
    p = pbtf.paragraphs[0]
    p.text = "PROBLEM STATEMENT"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    bullets_p = [
        "Legacy Static Portfolio: GRAHITA Design operated with a static, hardcoded website that required manual developer intervention for any content changes.",
        "Disconnected Spatial Identity: The firm specializes in avant-garde spatial architecture, yet its digital presence lacked interactive 3D spatial dimension.",
        "Zero Inquiries Pipeline: Inquiries were unvalidated, leading to missed client leads and potential email spoofing."
    ]
    for b in bullets_p:
        pb = pbtf.add_paragraph()
        pb.space_before = Pt(4)
        pb.text = "• " + b
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_TEXT_MAIN

    add_card(slide2, Inches(0.8), Inches(4.15), Inches(4.3), Inches(2.7))
    tb_box = slide2.shapes.add_textbox(Inches(1.0), Inches(4.3), Inches(3.9), Inches(2.3))
    tbtf = tb_box.text_frame
    tbtf.word_wrap = True
    p = tbtf.paragraphs[0]
    p.text = "TARGET TRANSFORMATION"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    bullets_t = [
        "Dynamic Database-Driven Backend: Full relational lifecycle via NestJS + SQLite for zero-latency execution.",
        "Bilingual Localization: Complete parity between Chinese (Mandarin) and English architectural specs and project narratives.",
        "3D WebGL Coordination: Real-time synchronization between relational database records and 55 Three.js spatial cube portals."
    ]
    for b in bullets_t:
        pb = tbtf.add_paragraph()
        pb.space_before = Pt(4)
        pb.text = "• " + b
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_TEXT_MAIN

    # Right Column: 5 Deliverables (Width 7.1 in)
    delivs = [
        ("1. Database-Driven Portfolio Catalog", "Comprehensive CRUD endpoints for architectural projects, relational multi-image galleries, and bilingual metadata (Chinese & English)."),
        ("2. Validated Client Inquiry System", "Secure POST /contact route with class-validator DTOs, and asynchronous dual Nodemailer SMTP notifications to studio and client."),
        ("3. Interactive 3D Spatial Canvas Sync", "Dynamic coordinate mapping linking database project records to 55 Three.js interactive cube mesh portals without index collision."),
        ("4. Scalable Monorepo Workflow", "Unified developer experience using 'concurrently' to launch NestJS backend and Angular 18 frontend with one unified command."),
        ("5. Secured Admin Content Management Dashboard", "Administrative authentication with Passport JWT and bcrypt, enabling independent studio portfolio management without developer support.")
    ]

    for idx, (title, desc) in enumerate(delivs):
        dy = Inches(1.4) + idx * Inches(1.08)
        add_card(slide2, Inches(5.35), dy, Inches(7.15), Inches(0.98))
        
        dbox = slide2.shapes.add_textbox(Inches(5.55), dy + Inches(0.1), Inches(6.75), Inches(0.78))
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

    slide2.notes_slide.notes_text_frame.text = (
        "On Slide 2, we outline the client's business context. GRAHITA Design needed to modernize its brand identity. "
        "Their prior website was purely static, unable to represent their complex spatial architecture, and had no administrative CMS. "
        "Our development team at Code Cipta established five core deliverables: a database-driven bilingual catalog, a validated inquiry pipeline "
        "with dual SMTP notification, an interactive 3D WebGL spatial synchronization algorithm, a unified monorepo developer setup, and a secured "
        "admin content management dashboard. As the backend developer, my responsibility was to architect and deliver the entire server-side system."
    )

    # =========================================================================
    # SLIDE 3: METHODOLOGY: HYBRID WATERFALL-AGILE
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "02 | ENGINEERING METHODOLOGY", "Methodology: Hybrid Waterfall-Agile Model")

    # Column 1: Upfront Waterfall
    add_card(slide3, Inches(0.8), Inches(1.4), Inches(5.7), Inches(4.3))
    wf_box = slide3.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(5.3), Inches(3.9))
    wt_tf = wf_box.text_frame
    wt_tf.word_wrap = True
    p = wt_tf.paragraphs[0]
    p.text = "UPFRONT WATERFALL FOUNDATION (WEEKS 1 – 4)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    wf_points = [
        ("Requirements Analysis:", "Formal stakeholder alignment with studio principal Bli Dek and Code Cipta Product Leader to lock data scope."),
        ("Relational Schema Freezing:", "Designed and locked ERD entities (Project, ProjectImage, Contact) to prevent catastrophic mid-project relational redesigns."),
        ("Modular Architecture Scaffolding:", "NestJS modular structure and TypeORM SQLite connection established before coding user features."),
        ("Security & DTO Standard:", "Established class-validator rules and API contract conventions across both development teams.")
    ]
    for h, b in wf_points:
        p1 = wt_tf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = C_TEXT_MAIN

    # Column 2: Iterative Agile Sprints
    add_card(slide3, Inches(6.8), Inches(1.4), Inches(5.7), Inches(4.3))
    ag_box = slide3.shapes.add_textbox(Inches(7.0), Inches(1.6), Inches(5.3), Inches(3.9))
    ag_tf = ag_box.text_frame
    ag_tf.word_wrap = True
    p = ag_tf.paragraphs[0]
    p.text = "ITERATIVE AGILE SPRINTS (WEEKS 6 – 14)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    ag_points = [
        ("2-Week Sprint Cycles:", "Iterative delivery of Projects CRUD, Contact Form, Passport JWT Auth, and Admin Dashboard CMS."),
        ("Continuous Frontend Co-Development:", "Daily API contract synchronization with Kevin Wiratama (Angular 18) via Discord & Postman."),
        ("Adaptive Scope Refinement:", "Accommodated late-stage client additions: 3D cube slot mapping, multi-image upload galleries, and bilingual fields."),
        ("Bi-Weekly Client Reviews:", "Regular milestone demos with Bli Dek to test working increments and capture feedback early.")
    ]
    for h, b in ag_points:
        p1 = ag_tf.add_paragraph()
        p1.space_before = Pt(8)
        p1.text = "• " + h + " " + b
        p1.font.size = Pt(9.5)
        p1.font.color.rgb = C_TEXT_MAIN

    # Bottom Academic Justification Box
    add_card(slide3, Inches(0.8), Inches(5.9), Inches(11.7), Inches(1.05), bg_color=C_CARD_DARK)
    cite_box = slide3.shapes.add_textbox(Inches(1.0), Inches(6.0), Inches(11.3), Inches(0.85))
    ctf = cite_box.text_frame
    ctf.word_wrap = True
    cp = ctf.paragraphs[0]
    cp.text = "ACADEMIC JUSTIFICATION (Wankhede, 2016):"
    cp.font.size = Pt(9.5)
    cp.font.bold = True
    cp.font.color.rgb = C_ACCENT_BLUE

    cp2 = ctf.add_paragraph()
    cp2.space_before = Pt(2)
    cp2.text = (
        '"A hybrid Waterfall-Agile approach is the most pragmatic model for database-driven engineering: '
        'locking critical architectural schema foundations upfront prevents expensive database refactoring, '
        'while iterative sprints allow rapid UI adaptation to client feedback."'
    )
    cp2.font.size = Pt(9)
    cp2.font.italic = True
    cp2.font.color.rgb = C_TEXT_WHITE

    slide3.notes_slide.notes_text_frame.text = (
        "Slide 3 details our methodology. We implemented a hybrid Waterfall-Agile lifecycle. "
        "A purely Agile approach would have been hazardous because relational databases underpin the entire system—redesigning table structures "
        "mid-development would break active endpoints. Thus, the Waterfall phase locked our schema and NestJS architecture. "
        "Then, 2-week Agile sprints allowed us to build features iteratively, collaborate with Kevin on frontend bindings, and adapt to client feedback. "
        "This aligns with software engineering literature by Wankhede (2016) on blending stability with delivery agility."
    )

    # =========================================================================
    # SLIDE 4: SYSTEM ARCHITECTURE & MODULAR BACKEND
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "03 | SYSTEM ARCHITECTURE", "System Architecture & Modular Request Pipeline")

    # Left Column: Technical Bullets (Width 5.5 in)
    add_card(slide4, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    arch_box = slide4.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    atf = arch_box.text_frame
    atf.word_wrap = True

    atitle = atf.paragraphs[0]
    atitle.text = "MODULAR ARCHITECTURE SPECIFICATIONS"
    atitle.font.size = Pt(11)
    atitle.font.bold = True
    atitle.font.color.rgb = C_PRIMARY

    arch_bullets = [
        ("NestJS Framework (TypeScript):", "Strict modular design implementing Controllers, Services, and Dependency Injection (DI) for testable and maintainable code."),
        ("High-Performance Data Layer:", "SQLite with native 'better-sqlite3' binding. Zero-latency embedded database with no external network socket overhead, managed through TypeORM."),
        ("Security & Rate Limiting:", "@nestjs/throttler configured globally (100 req/60s), with strict limits on /contact and /auth/login to protect against brute-force attacks."),
        ("DTO Validation Pipe:", "Global ValidationPipe with 'whitelist: true' and 'transform: true' to automatically strip unauthorized payload properties and cast types."),
        ("CORS Security Policy:", "Configured in main.ts with strict origin whitelisting for Angular frontend localhost:4200 and production domain."),
        ("Static Asset Serving:", "NestExpressApplication useStaticAssets maps physical './uploads/' directory to public '/uploads/' HTTP endpoints.")
    ]

    for h, b in arch_bullets:
        p = atf.add_paragraph()
        p.space_before = Pt(6)
        p.text = "• " + h + " " + b
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in)
    add_placeholder(
        slide4,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Insert a clean screenshot of the NestJS modular architecture diagram or code snippet from backend/src/app.module.ts "
        "and main.ts highlighting TypeOrmModule, ThrottlerModule, CORS whitelist, and ValidationPipe registration."
    )

    slide4.notes_slide.notes_text_frame.text = (
        "On Slide 4, we examine the server-side architectural foundation. "
        "We chose NestJS because its opinionated Controller-Service-Module pattern mirrors Angular's architecture, creating a unified development mental model. "
        "Our data tier leverages SQLite via native 'better-sqlite3' bindings. For an architecture studio portfolio, this offers sub-millisecond local queries "
        "with zero operational database server maintenance. "
        "Every incoming HTTP request traverses our global ValidationPipe to sanitize payload attributes and the ThrottlerModule to prevent spam. "
        "The right card indicates where to paste the AppModule and main.ts code diagram."
    )

    # =========================================================================
    # SLIDE 5: RELATIONAL DATA MODEL & DYNAMIC SEEDING
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "04 | DATA PERSISTENCE", "Relational Data Model & Lifecycle Auto-Seeding")

    # Left Column: Entities & Seeding (Width 5.5 in)
    add_card(slide5, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    ent_box = slide5.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    etf = ent_box.text_frame
    etf.word_wrap = True

    etitle = etf.paragraphs[0]
    etitle.text = "ENTITY RELATIONSHIPS & DATA LIFECYCLE"
    etitle.font.size = Pt(11)
    etitle.font.bold = True
    etitle.font.color.rgb = C_PRIMARY

    ent_bullets = [
        ("Project Entity:", "Primary table holding title, category, location, completion year, description, and the unique 3D spatial slot 'cubeIndex'."),
        ("ProjectImage Entity:", "@OneToMany / @ManyToOne relation with Project, featuring 'cascade: true', 'eager: true', and an 'isCover' boolean synced to thumbnailUrl."),
        ("Contact Entity:", "Stores client architectural inquiries with validated sender name, email, message, and created_at timestamps."),
        ("User Entity:", "Stores administrative credentials with high-entropy bcrypt salted password hashes (10 rounds)."),
        ("Lifecycle Auto-Seeder (OnModuleInit):", "Integrated in ProjectsService.onModuleInit(). Verifies database table record count upon startup. If empty, automatically seeds 5 realistic architectural projects and admin account without requiring manual SQL imports.")
    ]

    for h, b in ent_bullets:
        p = etf.add_paragraph()
        p.space_before = Pt(8)
        p.text = "• " + h + " " + b
        p.font.size = Pt(9.2)
        p.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in)
    add_placeholder(
        slide5,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Insert the Entity Relationship Diagram (ERD) or code snippet from backend/src/projects/project.entity.ts "
        "displaying TypeORM decorators (@Entity, @PrimaryGeneratedColumn, @Column, @OneToMany, cascade: true)."
    )

    slide5.notes_slide.notes_text_frame.text = (
        "Slide 5 describes the relational schema design and seeding mechanism. "
        "Our schema models architectural realities: a Project has multiple gallery photos (ProjectImage) linked via a cascading one-to-many relationship. "
        "Crucially, the Project entity includes the 'cubeIndex' column, which anchors each project to a specific 3D coordinate in the browser. "
        "To streamline development and grading evaluations, I engineered an automated seeding routine using NestJS's OnModuleInit lifecycle hook: "
        "if the database is blank on launch, five pre-configured architectural projects and an admin user are seeded instantly."
    )

    # =========================================================================
    # SLIDE 6: KEY TECHNICAL CHALLENGE: 3D SPATIAL COORDINATION ALGORITHM
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "05 | CORE ALGORITHM", "Key Technical Challenge: 3D Spatial Slot Coordination")

    # Top Challenge Box
    add_card(slide6, Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.15))
    ch_box = slide6.shapes.add_textbox(Inches(1.0), Inches(1.48), Inches(11.3), Inches(0.95))
    ctf = ch_box.text_frame
    ctf.word_wrap = True
    p = ctf.paragraphs[0]
    p.text = "THE SPATIAL COORDINATION CHALLENGE"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    p2 = ctf.add_paragraph()
    p2.space_before = Pt(2)
    p2.text = (
        "The frontend Three.js spatial field renders 55 discrete 3D wireframe cubes in dynamic 3D space. "
        "Each project can occupy one spatial portal (cubeIndex 0–54). A critical business rule requires that two projects "
        "must NEVER claim the same cubeIndex simultaneously, as this causes WebGL mesh coordinate collisions and broken hover routing."
    )
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_TEXT_MAIN

    # Split Layout: Left Explanation, Right Code
    # Left Box (Width 5.5 in)
    add_card(slide6, Inches(0.8), Inches(2.7), Inches(5.5), Inches(4.2))
    sol_box = slide6.shapes.add_textbox(Inches(1.0), Inches(2.85), Inches(5.1), Inches(3.9))
    stf = sol_box.text_frame
    stf.word_wrap = True
    p = stf.paragraphs[0]
    p.text = "ALGORITHMIC SOLUTION: handleCubeIndexConflict"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    sol_steps = [
        ("Targeted Querying:", "When creating or updating a project, the algorithm checks if the desired cubeIndex is already claimed."),
        ("Self-Exclusion via TypeORM Not():", "When updating, it uses 'id: Not(currentProjectId)' to ensure the project doesn't conflict with itself."),
        ("Atomic Conflict Disassociation:", "If an existing project occupies the slot, its cubeIndex is set to null and saved, gracefully ejecting it from the 3D canvas."),
        ("Deterministic Slot Assignment:", "The new project claims the slot with guaranteed uniqueness, maintaining perfect synchronization with the frontend Three.js raycaster.")
    ]
    for h, b in sol_steps:
        p = stf.add_paragraph()
        p.space_before = Pt(6)
        p.text = "• " + h + " " + b
        p.font.size = Pt(9.2)
        p.font.color.rgb = C_TEXT_MAIN

    # Right Box: Real Code Snippet Box (Width 5.9 in)
    add_card(slide6, Inches(6.6), Inches(2.7), Inches(5.9), Inches(4.2), bg_color=C_CODE_BG)
    code_box = slide6.shapes.add_textbox(Inches(6.75), Inches(2.85), Inches(5.6), Inches(3.9))
    cotf = code_box.text_frame
    cotf.word_wrap = True
    
    cp_title = cotf.paragraphs[0]
    cp_title.text = "// backend/src/projects/projects.service.ts"
    cp_title.font.name = "Consolas"
    cp_title.font.size = Pt(8.5)
    cp_title.font.color.rgb = RGBColor(148, 163, 184)

    code_lines = [
        "async handleCubeIndexConflict(",
        "  cubeIndex: number | null | undefined,",
        "  currentProjectId?: number",
        ") {",
        "  if (cubeIndex !== null && cubeIndex !== undefined) {",
        "    const whereCondition = currentProjectId",
        "      ? { cubeIndex, id: Not(currentProjectId) }",
        "      : { cubeIndex };",
        "    ",
        "    const conflictingProject = await this.projectRepository",
        "      .findOne({ where: whereCondition });",
        "    ",
        "    if (conflictingProject) {",
        "      conflictingProject.cubeIndex = null;",
        "      await this.projectRepository.save(conflictingProject);",
        "    }",
        "  }",
        "}"
    ]
    for line in code_lines:
        lp = cotf.add_paragraph()
        lp.text = line
        lp.font.name = "Consolas"
        lp.font.size = Pt(8.5)
        lp.font.color.rgb = RGBColor(56, 189, 248) if "handleCubeIndexConflict" in line or "Not" in line else RGBColor(241, 245, 249)

    slide6.notes_slide.notes_text_frame.text = (
        "Slide 6 presents our primary technical engineering challenge. "
        "In our system, the frontend Three.js engine dynamically builds 55 3D spatial cubes. "
        "If two projects had the same cube index, the 3D raycaster would attempt to bind two distinct architecture pages to the exact same WebGL mesh coordinate. "
        "To solve this, I designed and coded the 'handleCubeIndexConflict' algorithm. "
        "Notice the TypeORM query using 'Not(currentProjectId)': if an administrative user assigns project A to cube 12 while project B already has cube 12, "
        "the backend automatically detaches project B by setting its cubeIndex to null before saving project A. "
        "This ensures absolute mathematical uniqueness across our spatial API."
    )

    # =========================================================================
    # SLIDE 7: INQUIRY PIPELINE, SMTP MAILER & ROUTE SECURITY
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "06 | COMMUNICATION & SECURITY", "Client Inquiry Pipeline, SMTP Mailer & Route Protection")

    # Left Column: Bullets (Width 5.5 in)
    add_card(slide7, Inches(0.8), Inches(1.4), Inches(5.5), Inches(5.5))
    sec_box = slide7.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.1), Inches(5.2))
    stf = sec_box.text_frame
    stf.word_wrap = True

    stitle = stf.paragraphs[0]
    stitle.text = "DUAL EMAIL DISPATCH & AUTHENTICATION"
    stitle.font.size = Pt(11)
    stitle.font.bold = True
    stitle.font.color.rgb = C_PRIMARY

    sec_bullets = [
        ("Input Validation via class-validator:", "CreateContactDto strictly enforces @IsNotEmpty(), @IsEmail(), and @Length() constraints before processing."),
        ("Asynchronous Dual Nodemailer Dispatch:", "Upon saving inquiry to SQLite, MailModule triggers two non-blocking email dispatches:"),
        ("  1. Studio Admin Notification:", "Dispatches full inquiry details to studio email (gusari2271@gmail.com) with replyTo automatically configured to client's email."),
        ("  2. Client Automated Confirmation:", "Sends an official branded receipt confirmation back to the prospective client."),
        ("Simulation Fallback Mode:", "If SMTP credentials are not yet set in .env, MailService logs formatted dispatch previews to the terminal without crashing."),
        ("Administrative Route Protection:", "Passport.js JwtStrategy validates Bearer tokens. JwtAuthGuard guards all mutation routes (POST, PUT, DELETE), returning 401 Unauthorized for unauthenticated requests.")
    ]

    for h, b in sec_bullets:
        p = stf.add_paragraph()
        p.space_before = Pt(5)
        p.text = ("• " + h + " " + b) if not h.startswith("  ") else ("   " + h.strip() + " " + b)
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_MAIN

    # Right Column: Screenshot Placeholder (Width 5.9 in)
    add_placeholder(
        slide7,
        Inches(6.6), Inches(1.4), Inches(5.9), Inches(5.5),
        "Insert a code screenshot of backend/src/contact/contact.service.ts showing sendContactInquiryNotification "
        "and sendContactFormConfirmation dispatch, or a screenshot of incoming test emails in the inbox / terminal console dispatch logs."
    )

    slide7.notes_slide.notes_text_frame.text = (
        "Slide 7 showcases our inquiry communication pipeline and API route security. "
        "When prospective architectural clients submit inquiries, NestJS validates the payload with class-validator. "
        "Then, our MailModule executes asynchronous dual email dispatch: the studio administrator receives the full client message "
        "with the replyTo header pointing to the client, while the client immediately receives an automated confirmation receipt. "
        "Crucially, I implemented a simulation fallback mode: if SMTP credentials are absent in local development, it safely logs the email "
        "to the console without breaking database transactions. "
        "Administrative write operations are guarded by Passport JWT tokens with 100% test coverage in Postman."
    )

    # =========================================================================
    # SLIDE 8: INTEGRATION & INTERFACE SHOWCASE (ANGULAR 18 & THREE.JS)
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "07 | FULL-STACK INTEGRATION", "Frontend Integration & Interactive 3D Interface Showcase")

    # Top Overview Bar
    add_card(slide8, Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.05))
    int_box = slide8.shapes.add_textbox(Inches(1.0), Inches(1.48), Inches(11.3), Inches(0.85))
    itf = int_box.text_frame
    itf.word_wrap = True
    p = itf.paragraphs[0]
    p.text = "ANGULAR 18 & THREE.JS INTERACTION ARCHITECTURE"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    p2 = itf.add_paragraph()
    p2.space_before = Pt(2)
    p2.text = (
        "• Frontend Developed by Kevin Wiratama: Consumes NestJS REST endpoints via Angular HttpClient with JWT Bearer Interceptors.\n"
        "• Bilingual Localization: English and Chinese (Mandarin) architectural specifications rendered dynamically from backend fields.\n"
        "• Three.js Spatial Engine: Raycasting collision detection, glassmorphism hover tooltips, and seamless click routing to project details."
    )
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = C_TEXT_MAIN

    # Two Placeholders Side by Side (Width 5.7 in each)
    add_placeholder(
        slide8,
        Inches(0.8), Inches(2.6), Inches(5.7), Inches(4.3),
        "Insert screenshot of the public Home/Manifestation page showing the interactive Three.js 3D spatial cube canvas "
        "in an active hovered state displaying project title, category, and cube index."
    )

    add_placeholder(
        slide8,
        Inches(6.8), Inches(2.6), Inches(5.7), Inches(4.3),
        "Insert screenshot of the Admin Dashboard (/admin/dashboard) displaying the project catalog table, "
        "multi-image upload dropzone, and 3D cube index assignment dropdown."
    )

    slide8.notes_slide.notes_text_frame.text = (
        "Slide 8 displays the full-stack system in action. "
        "My backend APIs were integrated with an Angular 18 frontend developed by Kevin Wiratama. "
        "The public website features a Three.js WebGL canvas where users navigate 55 3D spatial cubes. "
        "When hovered, raycasters detect the cube, fetch the bound project details, and show glassmorphic tooltips in English or Chinese. "
        "On the right, we showcase the Admin Dashboard: studio administrators can log in securely, upload multiple high-resolution photos, "
        "and modify cube slot indices without ever touching a database console."
    )

    # =========================================================================
    # SLIDE 9: PROBLEM SOLVING & ISSUE ISOLATION (ADMIN PARTIAL UPDATE BUG)
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "08 | PROBLEM SOLVING & QUALITY ASSURANCE", "Engineering Diagnosis: Admin Partial Update Bug Isolation")

    # 3 Sequential Cards
    cards_data = [
        (
            "1. SYMPTOM & INVESTIGATION",
            [
                "Intermittent Error on PUT /projects/:id when updating text descriptions and replacing gallery images in a single payload.",
                "Systematic Postman batch testing isolated the defect away from controller routes and validation pipes.",
                "NestJS application trace logs confirmed the error originated strictly within the TypeORM entity persistence layer."
            ],
            C_PRIMARY
        ),
        (
            "2. ROOT CAUSE IDENTIFIED",
            [
                "Concurrency clash between Multer disk file streaming and the 'keepImageIds' child entity filter.",
                "TypeORM cascade reconciliation attempted to persist the parent Project while child ProjectImage entities were temporarily in detached state.",
                "Entity state mismatch caused SQLite relational constraint conflicts during complex multi-part updates."
            ],
            C_GOLD
        ),
        (
            "3. MITIGATION & ISOLATION",
            [
                "Engineered a transaction refactor using explicit TypeORM QueryRunner to ensure atomic commit or rollback.",
                "Implemented fallback image retention logic to prevent accidental image orphaned files on disk.",
                "Strict Boundary Isolation: Public routes, 3D spatial scene, and contact form operate at 100% stability with zero impact."
            ],
            C_ACCENT_BLUE
        )
    ]

    for idx, (head, points, accent) in enumerate(cards_data):
        cx = Inches(0.8) + idx * Inches(4.0)
        add_card(slide9, cx, Inches(1.4), Inches(3.7), Inches(4.4))
        
        box = slide9.shapes.add_textbox(cx + Inches(0.18), Inches(1.6), Inches(3.34), Inches(4.0))
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
            p_b.font.size = Pt(9)
            p_b.font.color.rgb = C_TEXT_MAIN

    # Bottom Boundary Notice Box
    add_card(slide9, Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.95), bg_color=C_CARD_DARK)
    bn_box = slide9.shapes.add_textbox(Inches(1.0), Inches(6.1), Inches(11.3), Inches(0.75))
    bntf = bn_box.text_frame
    bntf.word_wrap = True
    p = bntf.paragraphs[0]
    p.text = "OPERATIONAL BOUNDARY & MATURITY REFLECTION:"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_ACCENT_BLUE

    p2 = bntf.add_paragraph()
    p2.space_before = Pt(2)
    p2.text = (
        "Transparent defect reporting and systematic root-cause isolation demonstrate genuine engineering maturity. "
        "The defect is fully understood, strictly bounded to administrative edge-case batch updates, and documented for transactional resolution."
    )
    p2.font.size = Pt(8.8)
    p2.font.color.rgb = C_TEXT_WHITE

    slide9.notes_slide.notes_text_frame.text = (
        "Slide 9 demonstrates diagnostic problem solving. During final testing of the Admin Dashboard, we encountered an intermittent error "
        "when modifying text metadata and replacing gallery photos simultaneously. "
        "Rather than ignoring it, I conducted systematic batch testing in Postman and inspected NestJS stack traces. "
        "I isolated the root cause: Multer file streaming concurrently with 'keepImageIds' filtering caused TypeORM to attempt cascade saving "
        "while child entities were detached. "
        "I designed an explicit QueryRunner transaction mitigation. Crucially, this defect is isolated entirely to admin batch edge-cases; "
        "all public endpoints, 3D portals, and contact forms operate at 100% stability. "
        "This transparent reporting was commended by my supervisor during my evaluation."
    )

    # =========================================================================
    # SLIDE 10: CONCLUSION, LEARNINGS & FUTURE OUTCOMES
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "09 | REFLECTION & CONCLUSION", "Conclusion, Professional Learnings & Outcomes")

    # 3 Summary Cards
    concl_data = [
        (
            "KEY PROJECT ACHIEVEMENTS",
            [
                "100% Backend Deliverables completed, deployed, and seamlessly integrated with Angular 18 & Three.js.",
                "Industry Evaluation: 94 / 100 (Grade: Excellent) awarded by Code Cipta development team supervisor.",
                "Successful formal client handover with Bli Dek on 30 September 2026 with complete client satisfaction."
            ],
            C_PRIMARY
        ),
        (
            "ACADEMIC VS. INDUSTRY LEARNINGS",
            [
                "Bridged university coursework (DB normalization, OOP, REST) to enterprise engineering (NestJS DI, CORS, JWT Auth).",
                "Professional Git workflow discipline: feature branching, Pull Requests, and peer reviews.",
                "Contract-first communication: moving from verbal agreements to formal Postman API workspace specifications."
            ],
            C_GOLD
        ),
        (
            "KEY TAKEAWAYS & FUTURE OUTLOOK",
            [
                "Schedule edge-case / combined multi-field testing earlier in sprint cycles rather than during final acceptance.",
                "Adopt Swagger OpenAPI documentation from Day 1 to eliminate frontend contract ambiguity.",
                "Future Horizon: Cloud object storage (AWS S3) and Role-Based Access Control (RBAC) for studio growth."
            ],
            C_PRIMARY
        )
    ]

    for idx, (head, points, accent) in enumerate(concl_data):
        cx = Inches(0.8) + idx * Inches(4.0)
        add_card(slide10, cx, Inches(1.4), Inches(3.7), Inches(4.5))
        
        box = slide10.shapes.add_textbox(cx + Inches(0.18), Inches(1.6), Inches(3.34), Inches(4.1))
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
            p_b.font.size = Pt(9)
            p_b.font.color.rgb = C_TEXT_MAIN

    # Bottom Q&A Banner
    add_card(slide10, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.85), bg_color=C_BG_DARK)
    qa_box = slide10.shapes.add_textbox(Inches(1.0), Inches(6.2), Inches(11.3), Inches(0.65))
    qatf = qa_box.text_frame
    qatf.word_wrap = True
    qp = qatf.paragraphs[0]
    qp.alignment = PP_ALIGN.CENTER
    qp.text = "THANK YOU FOR YOUR TIME & ATTENTION  |  QUESTIONS & ANSWERS (Q&A)"
    qp.font.size = Pt(11)
    qp.font.bold = True
    qp.font.color.rgb = C_ACCENT_BLUE

    slide10.notes_slide.notes_text_frame.text = (
        "In conclusion, my 12-week internship at Code Cipta has been an invaluable transformative experience. "
        "We fulfilled all project objectives for GRAHITA Design, delivering a modern, high-performance, and bilingual spatial portfolio. "
        "I was honored to receive an industry evaluation score of 94/100, which reflects both the technical execution and my dedication to professional growth. "
        "I would like to express my sincere gratitude to my supervisor at Code Cipta, my academic lecturers at HELP University, and my teammate Kevin. "
        "Thank you very much. I am now pleased to welcome any questions from the examiners."
    )

    out_path = "c:\\Users\\LENOVO\\Downloads\\CLONE GRAHITA\\Internship\\final_presentation_internship.pptx"
    prs.save(out_path)
    print(f"Successfully generated PowerPoint presentation: {out_path}")

if __name__ == "__main__":
    create_presentation()
