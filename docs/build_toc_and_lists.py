import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_toc_and_lists(doc, add_styled_table):
    # ==========================================
    # 6. TABLE OF CONTENTS (Page v)
    # ==========================================
    doc.add_page_break()
    p_toc_h = doc.add_paragraph()
    p_toc_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_h.paragraph_format.space_before = Pt(16)
    p_toc_h.paragraph_format.space_after = Pt(16)
    r_toc = p_toc_h.add_run("TABLE OF CONTENTS")
    r_toc.bold = True
    r_toc.font.name = "Times New Roman"
    r_toc.font.size = Pt(14)
    r_toc.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    toc_headers = ["Chapter / Section", "Title of Topic / Module", "Page"]
    toc_rows = [
        ["", "DECLARATION", "i"],
        ["", "CERTIFICATE", "ii"],
        ["", "ABSTRACT", "iii"],
        ["", "ACKNOWLEDGEMENT", "iv"],
        ["", "TABLE OF CONTENTS", "v"],
        ["", "LIST OF FIGURES", "vi"],
        ["", "LIST OF TABLES", "vii"],
        ["", "LIST OF ACRONYMS", "viii"],
        ["CHAPTER 1", "INTRODUCTION", "1"],
        ["1.1", "INTRODUCTION", "1"],
        ["1.2", "BACKGROUND", "2"],
        ["1.3", "PROBLEM STATEMENT", "2"],
        ["1.4", "OBJECTIVES OF THE PROJECT", "3"],
        ["1.5", "SCOPE OF THE PROJECT", "4"],
        ["1.6", "MOTIVATION", "5"],
        ["1.7", "REPORT ORGANIZATION", "6"],
        ["CHAPTER 2", "SYSTEM OVERVIEW", "7"],
        ["2.1", "EXISTING SYSTEM", "7"],
        ["2.2", "LIMITATIONS OF EXISTING SYSTEM", "8"],
        ["2.3", "PROPOSED SYSTEM", "8"],
        ["2.4", "COMPARISON: EXISTING VS PROPOSED SYSTEM", "9"],
        ["2.5", "ADVANTAGES OF PROPOSED SYSTEM", "10"],
        ["CHAPTER 3", "SYSTEM ARCHITECTURE", "11"],
        ["3.1", "OVERALL SYSTEM DESIGN", "11"],
        ["3.2", "TECHNOLOGY STACK SELECTION", "11"],
        ["3.3", "FRONTEND ARCHITECTURE", "12"],
        ["3.4", "WEBGL CONTEXT & RENDER LOOP ARCHITECTURE", "12"],
        ["3.5", "BACKEND ARCHITECTURE & SECURITY", "13"],
        ["3.6", "DATA ARCHITECTURE & UNIVERSAL SCHEMA", "13"],
        ["3.7", "DESIGN SYSTEM & TYPOGRAPHY TOKENS", "13"],
        ["CHAPTER 4", "MODULES DESCRIPTION", "15"],
        ["4.1", "3D EARTH EVOLUTION ENGINE & DEEP TIME SLIDER", "15"],
        ["4.2", "PLANETARY EPOCHS & ATMOSPHERIC SHADERS", "15"],
        ["4.3", "CHICXULUB ASTEROID IMPACT CUTSCENE", "15"],
        ["4.4", "VIRTUAL SPECIMEN ARCHIVE & 3D INSPECTOR", "15"],
        ["4.5", "MATERIAL DEGRADATION SANDBOX", "16"],
        ["4.6", "ARCHEOLOGICAL ORIGIN MAP & COMPARATOR", "16"],
        ["4.7", "ADMISSION PORTAL & 3D TICKET KIOSK", "16"],
        ["4.8", "PROCEDURAL WEB AUDIO ENGINE", "16"],
        ["4.9", "DOCENT AI GUIDANCE & INTERACTIVE MODALS", "16"],
        ["CHAPTER 5", "IMPLEMENTATION", "17"],
        ["5.1", "DEVELOPMENT ENVIRONMENT", "17"],
        ["5.2", "FRONTEND IMPLEMENTATION", "17"],
        ["5.3", "3D WEBGL RENDER LOOP & COLOR DAMPING", "18"],
        ["5.4", "PROCEDURAL PLANETARY SHADERS", "18"],
        ["5.5", "3D SPECIMEN INSPECTOR & DEGRADATION PIPELINE", "19"],
        ["5.6", "3D TICKET PHYSICS & WAX STAMP IMPLEMENTATION", "19"],
        ["5.7", "PROCEDURAL WEB AUDIO SYNTHESIS", "19"],
        ["5.8", "HARDWARE TIERING & DRACO COMPRESSION", "20"],
        ["5.9", "NEXT.JS APP ROUTER AUTH & SESSION HANDLERS", "20"],
        ["CHAPTER 6", "TESTING", "22"],
        ["6.1", "TESTING STRATEGY", "22"],
        ["6.2", "FUNCTIONAL TESTING", "22"],
        ["6.3", "3D WEBGL SHADER & PIPELINE TESTING", "23"],
        ["6.4", "PERFORMANCE TESTING", "23"],
        ["6.5", "ACCESSIBILITY & LIGHTHOUSE AUDIT", "24"],
        ["6.6", "OVERALL TEST SUMMARY", "24"],
        ["CHAPTER 7", "RESULTS AND DISCUSSION", "26"],
        ["7.1", "SYSTEM SCREENSHOTS", "26"],
        ["7.2", "PERFORMANCE RESULTS", "55"],
        ["7.3", "COMPARISON WITH EXISTING SYSTEM", "55"],
        ["7.4", "DISCUSSION", "56"],
        ["CHAPTER 8", "CONCLUSION AND FUTURE WORK", "57"],
        ["8.1", "CONCLUSION", "57"],
        ["8.2", "FUTURE ENHANCEMENTS", "59"],
        ["8.3", "FINAL REMARKS", "60"],
        ["", "REFERENCES", "61"],
        ["APPENDIX A", "INSTALLATION AND SETUP GUIDE", "63"],
        ["APPENDIX B", "COMPLETE UNIVERSAL ENTITY SCHEMA", "65"],
        ["APPENDIX C", "SCIENTIFIC PROVENANCE & SPECIMEN CATALOG", "67"],
        ["APPENDIX D", "REST API & GLOBAL STATE REFERENCE", "70"],
        ["APPENDIX E", "USER & CURATOR OPERATIONAL MANUAL", "73"],
        ["APPENDIX F", "TECHNICAL & SCIENTIFIC GLOSSARY", "75"]
    ]
    add_styled_table(doc, toc_headers, toc_rows, col_widths=[1.5, 3.5, 0.76])

    # ==========================================
    # 7. LIST OF FIGURES (Page vi)
    # ==========================================
    doc.add_page_break()
    p_lof_h = doc.add_paragraph()
    p_lof_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lof_h.paragraph_format.space_before = Pt(16)
    p_lof_h.paragraph_format.space_after = Pt(16)
    r_lof = p_lof_h.add_run("LIST OF FIGURES")
    r_lof.bold = True
    r_lof.font.name = "Times New Roman"
    r_lof.font.size = Pt(14)
    r_lof.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    lof_headers = ["Figure No.", "Title", "Page"]
    lof_rows = [
        ["Figure 7.1", "Home Page (Museum of Deep Time) — Landing Exhibition View", "26"],
        ["Figure 7.2", "Admission & 3D Ticket Desk — Living Museum Entrance Screen", "27"],
        ["Figure 7.3", "Earth Evolution Timeline & 3D ChronoTerra Globe View", "27"],
        ["Figure 7.4", "20-Specimen Paleontological & Cultural Artifact Gallery", "28"],
        ["Figure 7.5", "3D Specimen Deep-Dive Laboratory & Degradation Sandbox", "28"],
        ["Figure 7.6", "9-System Interactive Motion & ReactBits Lab", "29"],
        ["Figure 7.7", "404 Stratigraphic Void Error Recovery Screen", "29"],
        ["Figure 7.8", "Hero Section with Dynamic Deep-Time HUD & Coordinates", "30"],
        ["Figure 7.9", "Deep Time Proportional Logarithmic Scale Visualizer", "30"],
        ["Figure 7.10", "Five Planetary Epoch Pillars & Geological Stratum Display", "31"],
        ["Figure 7.11", "Featured Specimen Interactive Carousel & Hover States", "31"],
        ["Figure 7.12", "Side-by-Side Stratigraphic Comparator Architecture", "32"],
        ["Figure 7.13", "Big Five Mass Extinction Horizon & Mortality Metrics", "32"],
        ["Figure 7.14", "Institutional Provenance Ledger & Open Access Attributions", "33"],
        ["Figure 7.15", "Admission Pass Kiosk Section with Live Holographic Foil", "33"],
        ["Figure 7.16", "3D Model: ACC-F-001 — Jack Hills Zircon Crystal", "34"],
        ["Figure 7.17", "3D Model: ACC-F-002 — Pilbara Dresser Stromatolite Dome", "34"],
        ["Figure 7.18", "3D Model: ACC-F-003 — Grypania spiralis Coiled Filament", "35"],
        ["Figure 7.19", "3D Model: ACC-F-004 — Dickinsonia costata Ribbed Body", "35"],
        ["Figure 7.20", "3D Model: ACC-F-005 — Charnia masoni Frond Fossil", "36"],
        ["Figure 7.21", "3D Model: ACC-F-006 — Anomalocaris canadensis Apex Predator", "36"],
        ["Figure 7.22", "3D Model: ACC-F-007 — Paradoxides davidis Giant Trilobite", "37"],
        ["Figure 7.23", "3D Model: ACC-F-008 — Dunkleosteus terrelli Armored Jaw", "37"],
        ["Figure 7.24", "3D Model: ACC-F-009 — Tiktaalik roseae Transitional Limb", "38"],
        ["Figure 7.25", "3D Model: ACC-F-010 — Placenticeras meeki Suture Ammonite", "38"],
        ["Figure 7.26", "3D Model: ACC-F-011 — Archaeopteryx lithographica Feathered Slab", "39"],
        ["Figure 7.27", "3D Model: ACC-F-012 — Tyrannosaurus rex 'Sue' Skull Holotype", "39"],
        ["Figure 7.28", "3D Model: ACC-F-013 — Australopithecus afarensis 'Lucy' Fossil", "40"],
        ["Figure 7.29", "3D Model: ACC-F-014 — Mammuthus primigenius Preserved Molar", "40"],
        ["Figure 7.30", "3D Model: ACC-A-001 — Lomekwi 3 Pliocene Flaked Stone Core", "41"],
        ["Figure 7.31", "3D Model: ACC-A-002 — Olduvai Gorge Acheulean Biface Handaxe", "41"],
        ["Figure 7.32", "3D Model: ACC-A-003 — Blombos Cave Geometric Engraved Ochre", "42"],
        ["Figure 7.33", "3D Model: ACC-A-004 — Gravettian Venus of Willendorf Figurine", "42"],
        ["Figure 7.34", "3D Model: ACC-A-005 — Jomon Middle Period Flame-Rimmed Ceramic", "43"],
        ["Figure 7.35", "3D Model: ACC-A-006 — Uruk IV Proto-Cuneiform Grain Ledger", "43"],
        ["Figure 7.36", "3D Earth Globe: Hadean / Archean Incandescent Magma Sphere", "44"],
        ["Figure 7.37", "3D Earth Globe: Proterozoic Oxygenation & Banded Iron Formations", "44"],
        ["Figure 7.38", "3D Earth Globe: Paleozoic Pangea & Marine Radiation", "45"],
        ["Figure 7.39", "3D Earth Globe: Mesozoic Continental Rifting & Chicxulub Point", "45"],
        ["Figure 7.40", "3D Earth Globe: Cenozoic Glaciation & Anthropocene Night Lights", "46"],
        ["Figure 7.41", "3D Orbital Specimen Satellites & Chrono-Geodesic Coordinates", "46"],
        ["Figure 7.42", "3D Extinction Horizon Markers & Bolide Telemetry Overlay", "47"],
        ["Figure 7.43", "3D K-Pg Bolide Impact Kinetic Simulation & Thermal Shockwave", "47"],
        ["Figure 7.44", "3D Articulated Bauhaus Robot Docent Interactive Guide", "48"],
        ["Figure 7.45", "3D Neo-Brutalist Ticket Counter & Laser Stepper Kiosk", "48"],
        ["Figure 7.46", "3D Physics Admission Ticket with 24K Holographic Gold Seal", "49"],
        ["Figure 7.47", "Navbar & Floating Telemetry Header with Dynamic Audio Toggle", "49"],
        ["Figure 7.48", "Institutional Footer & Scientific Provenance Repository Links", "50"],
        ["Figure 7.49", "DeepTimeSlider with Non-Linear Epoch Snapping & Dilation", "50"],
        ["Figure 7.50", "Specimen Card with Neo-Brutalist Drop Shadow & Physics", "51"],
        ["Figure 7.51", "Shareable Digital Ticket Stub with Holographic Watermark", "51"],
        ["Figure 7.52", "Docent AI Primitives: ThinkingOrb, Live Reticle, Chat Bubble", "52"],
        ["Figure 7.53", "Command Palette (Cmd+K) Universal Search & Chrono-Jump Modal", "52"],
        ["Figure 7.54", "Field Notebook Modal: Guided Thematic Academic Tours", "53"],
        ["Figure 7.55", "Field Notebook Modal: Bookmarked Specimens & Chrono-Dossiers", "53"],
        ["Figure 7.56", "Field Notebook Modal: Evolutionary Biology Mastery Quiz", "54"],
        ["Figure 7.57", "Field Notebook Modal: Architectural UI Annotations & Notes", "54"],
        ["Figure 7.58", "Agentation Live Reticle Overlay & Real-Time DOM Matrix", "55"]
    ]
    add_styled_table(doc, lof_headers, lof_rows, col_widths=[1.2, 4.0, 0.56])

    # ==========================================
    # 8. LIST OF TABLES (Page vii)
    # ==========================================
    doc.add_page_break()
    p_lot_h = doc.add_paragraph()
    p_lot_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lot_h.paragraph_format.space_before = Pt(16)
    p_lot_h.paragraph_format.space_after = Pt(16)
    r_lot = p_lot_h.add_run("LIST OF TABLES")
    r_lot.bold = True
    r_lot.font.name = "Times New Roman"
    r_lot.font.size = Pt(14)
    r_lot.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    lot_headers = ["Table No.", "Title", "Page"]
    lot_rows = [
        ["Table 2.1", "Limitations of Existing Digital Museum & Heritage Platforms", "8"],
        ["Table 2.2", "Comparative Feature Matrix: Traditional vs. MUSEO", "9"],
        ["Table 3.1", "Technology Stack Evaluation & Architectural Rationale", "12"],
        ["Table 3.2", "System Color Token Palette & Neo-Brutalist Contrast Ratios", "14"],
        ["Table 5.1", "Core Development Tooling & Local Runtime Environment", "17"],
        ["Table 5.2", "Core Software Dependencies, Libraries & Versions", "17"],
        ["Table 6.1", "Functional Verification Test Cases — Admission & Auth", "22"],
        ["Table 6.2", "Functional Verification Test Cases — Earth Evolution", "23"],
        ["Table 6.3", "3D WebGL Shader & Graphic Pipeline Test Matrix", "23"],
        ["Table 6.4", "Cross-Device Hardware Performance & Frame-Rate Benchmarks", "24"],
        ["Table 6.5", "Google Lighthouse Audit & WCAG 2.1 AA Accessibility Results", "24"],
        ["Table 6.6", "Comprehensive Quality Assurance & Defect Resolution Summary", "25"],
        ["Table 7.1", "Benchmark Comparison of MUSEO Against Premier Digital Exhibits", "56"],
        ["Table C.1", "Scientific Provenance, Physical Repositories & Open Access", "69"],
        ["Table E.1", "Keyboard Navigation & Assistive Command Bindings", "74"],
        ["Table F.1", "Technical, Paleontological & Geological Domain Terminology", "77"]
    ]
    add_styled_table(doc, lot_headers, lot_rows, col_widths=[1.2, 4.0, 0.56])

    # ==========================================
    # 9. LIST OF ACRONYMS (Page viii)
    # ==========================================
    doc.add_page_break()
    p_loa_h = doc.add_paragraph()
    p_loa_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_loa_h.paragraph_format.space_before = Pt(16)
    p_loa_h.paragraph_format.space_after = Pt(16)
    r_loa = p_loa_h.add_run("LIST OF ACRONYMS")
    r_loa.bold = True
    r_loa.font.name = "Times New Roman"
    r_loa.font.size = Pt(14)
    r_loa.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    loa_headers = ["Abbreviation", "Full Form"]
    loa_rows = [
        ["2D / 3D", "Two-Dimensional / Three-Dimensional"],
        ["A11y", "Accessibility"],
        ["API", "Application Programming Interface"],
        ["AST", "Abstract Syntax Tree"],
        ["BCE / CE", "Before Common Era / Common Era"],
        ["BIF", "Banded Iron Formation"],
        ["CC0", "Creative Commons Zero (Public Domain Dedication)"],
        ["CDN", "Content Delivery Network"],
        ["CI / CD", "Continuous Integration / Continuous Deployment"],
        ["CSS", "Cascading Style Sheets"],
        ["DOM", "Document Object Model"],
        ["DPR", "Device Pixel Ratio"],
        ["DRACO", "Google 3D Geometric Mesh Compression Library"],
        ["FPS", "Frames Per Second"],
        ["GLB / GLTF", "Graphics Language Transmission Format (Binary / JSON)"],
        ["GLSL", "OpenGL Shading Language"],
        ["GPU", "Graphics Processing Unit"],
        ["GSAP", "GreenSock Animation Platform"],
        ["HOD", "Head of Department"],
        ["HTML", "HyperText Markup Language"],
        ["HTTP / HTTPS", "HyperText Transfer Protocol (Secure)"],
        ["HUD", "Heads-Up Display"],
        ["JSON", "JavaScript Object Notation"],
        ["JWT", "JSON Web Token (RFC 7519)"],
        ["K-Pg", "Cretaceous–Paleogene Extinction Boundary"],
        ["LCP", "Largest Contentful Paint"],
        ["LERP", "Linear Interpolation"],
        ["MVC", "Model-View-Controller"],
        ["MYA", "Million Years Ago"],
        ["PBR", "Physically Based Rendering"],
        ["PDF", "Portable Document Format"],
        ["R3F", "React Three Fiber"],
        ["RBAC", "Role-Based Access Control"],
        ["REST", "Representational State Transfer"],
        ["SDK", "Software Development Kit"],
        ["UI", "User Interface"],
        ["UX", "User Experience"],
        ["WASM", "WebAssembly"],
        ["WCAG", "Web Content Accessibility Guidelines"],
        ["WebGL", "Web Graphics Library"],
        ["ZOD", "TypeScript-First Schema Declaration & Validation Library"]
    ]
    add_styled_table(doc, loa_headers, loa_rows, col_widths=[1.5, 4.26])

    print("Table of contents, list of figures, tables, and acronyms generated.")
