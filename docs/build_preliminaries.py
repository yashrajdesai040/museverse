import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_preliminary_pages(doc, logo_path):
    # ==========================================
    # 1. TITLE / COVER PAGE (Page 1)
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("GOVERNMENT POLYTECHNIC PALANPUR")
    r_inst.bold = True
    r_inst.font.name = "Times New Roman"
    r_inst.font.size = Pt(15)
    r_inst.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    p_dept = doc.add_paragraph()
    p_dept.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(0)
    p_dept.paragraph_format.space_after = Pt(16)
    r_dept = p_dept.add_run("Department of IT Engineering")
    r_dept.font.name = "Times New Roman"
    r_dept.font.size = Pt(13)
    r_dept.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    # Insert College Logo
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(16)
        run_logo = p_logo.add_run()
        run_logo.add_picture(logo_path, width=Inches(1.4))

    p_rep = doc.add_paragraph()
    p_rep.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rep.paragraph_format.space_before = Pt(8)
    p_rep.paragraph_format.space_after = Pt(4)
    r_rep = p_rep.add_run("A PROJECT REPORT ON")
    r_rep.font.name = "Times New Roman"
    r_rep.font.size = Pt(12)
    r_rep.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    p_title = doc.add_paragraph()
    p_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("MUSEO: THE VIRTUAL MUSEUM OF\nDEEP TIME & EARTH EVOLUTION")
    r_title.bold = True
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(16)
    r_title.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(2)
    p_sub.paragraph_format.space_after = Pt(22)
    r_sub = p_sub.add_run("An Interactive 3D WebGL Paleontological & Chrono-Spatial Web Experience")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    p_subm = doc.add_paragraph()
    p_subm.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subm.paragraph_format.space_before = Pt(8)
    p_subm.paragraph_format.space_after = Pt(2)
    r_subm = p_subm.add_run("Submitted in Partial Fulfillment of the Requirements for the\nDiploma in IT Engineering\n(6th Semester)")
    r_subm.font.name = "Times New Roman"
    r_subm.font.size = Pt(11)
    r_subm.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    p_subinfo = doc.add_paragraph()
    p_subinfo.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subinfo.paragraph_format.space_before = Pt(2)
    p_subinfo.paragraph_format.space_after = Pt(22)
    r_subinfo = p_subinfo.add_run("Subject: Software Development  |  Academic Year: 2025–2026")
    r_subinfo.font.name = "Times New Roman"
    r_subinfo.font.size = Pt(11)
    r_subinfo.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    # Student & Guide Details
    p_by = doc.add_paragraph()
    p_by.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(10)
    p_by.paragraph_format.space_after = Pt(2)
    r_by_lbl = p_by.add_run("Submitted By:\n")
    r_by_lbl.font.name = "Times New Roman"
    r_by_lbl.font.size = Pt(11)
    r_by_name = p_by.add_run("PRAJAPATI DIXIT K.\n")
    r_by_name.bold = True
    r_by_name.font.name = "Times New Roman"
    r_by_name.font.size = Pt(12)
    r_by_enr = p_by.add_run("Enrollment No.: 236260316028\n6th Semester  |  Academic Year: 2025–2026")
    r_by_enr.font.name = "Times New Roman"
    r_by_enr.font.size = Pt(11)

    p_guide = doc.add_paragraph()
    p_guide.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_before = Pt(12)
    p_guide.paragraph_format.space_after = Pt(0)
    r_guide_lbl = p_guide.add_run("Under the Guidance of:\n")
    r_guide_lbl.font.name = "Times New Roman"
    r_guide_lbl.font.size = Pt(11)
    r_guide_name = p_guide.add_run("Prof. Chinkal Khadadiya\n")
    r_guide_name.bold = True
    r_guide_name.font.name = "Times New Roman"
    r_guide_name.font.size = Pt(12)
    r_guide_inst = p_guide.add_run("Department of IT Engineering\nGovernment Polytechnic Palanpur")
    r_guide_inst.font.name = "Times New Roman"
    r_guide_inst.font.size = Pt(11)

    # ==========================================
    # 2. DECLARATION (Page i)
    # ==========================================
    doc.add_page_break()
    p_dec_title = doc.add_paragraph()
    p_dec_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec_title.paragraph_format.space_before = Pt(16)
    p_dec_title.paragraph_format.space_after = Pt(16)
    r_dec_h = p_dec_title.add_run("DECLARATION")
    r_dec_h.bold = True
    r_dec_h.font.name = "Times New Roman"
    r_dec_h.font.size = Pt(14)

    p_dec_body = doc.add_paragraph()
    p_dec_body.paragraph_format.line_spacing = 1.5
    p_dec_body.paragraph_format.space_after = Pt(10)
    p_dec_body.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dec_body.add_run(
        "I, Prajapati Dixit K., student of Diploma in IT Engineering, Semester 6th, Enrollment Number 236260316028, Government Polytechnic Palanpur, hereby declare that the project report entitled:\n\n"
    )
    r_p_title = p_dec_body.add_run('"MUSEO: THE VIRTUAL MUSEUM OF DEEP TIME & EARTH EVOLUTION"\n')
    r_p_title.bold = True
    r_p_sub = p_dec_body.add_run("An Interactive 3D WebGL Paleontological & Chrono-Spatial Web Experience\n")
    p_dec_body.add_run(
        "submitted in partial fulfillment of the requirements for the subject Software Development is my own original work. This project has been carried out under the guidance of Prof. Chinkal Khadadiya, Department of IT Engineering, Government Polytechnic Palanpur.\n\n"
        "I further declare that:\n"
        "● This work has not been previously submitted to any other institution or university for the award of any certificate, diploma, or degree.\n"
        "● All information and content presented in this report are based on genuine research and development work carried out by me.\n"
        "● Wherever the work of others has been referred to, full and proper credit has been given through references and citations.\n"
        "● This report presents a truthful and accurate account of the work performed during the project.\n"
        "● No part of this report has been copied from any other student's work or from any published source without proper acknowledgment."
    )

    p_dec_sig = doc.add_paragraph()
    p_dec_sig.paragraph_format.space_before = Pt(28)
    p_dec_sig.paragraph_format.space_after = Pt(0)
    p_dec_sig.paragraph_format.line_spacing = 1.3
    p_dec_sig.add_run(
        "Place: Palanpur\n"
        "Date: _______________\n\n"
        "Signature of Student:\n"
        "D.K.Prajapati.\n"
        "Enrollment No.: 236260316028"
    )

    # ==========================================
    # 3. CERTIFICATE (Page ii)
    # ==========================================
    doc.add_page_break()
    p_cert_inst = doc.add_paragraph()
    p_cert_inst.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_inst.paragraph_format.space_before = Pt(12)
    p_cert_inst.paragraph_format.space_after = Pt(2)
    r_c_inst = p_cert_inst.add_run("GOVERNMENT POLYTECHNIC PALANPUR")
    r_c_inst.bold = True
    r_c_inst.font.name = "Times New Roman"
    r_c_inst.font.size = Pt(14)

    p_cert_dept = doc.add_paragraph()
    p_cert_dept.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_dept.paragraph_format.space_before = Pt(0)
    p_cert_dept.paragraph_format.space_after = Pt(16)
    r_c_dept = p_cert_dept.add_run("Department of IT Engineering")
    r_c_dept.font.name = "Times New Roman"
    r_c_dept.font.size = Pt(12)

    p_cert_h = doc.add_paragraph()
    p_cert_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_h.paragraph_format.space_before = Pt(8)
    p_cert_h.paragraph_format.space_after = Pt(16)
    r_c_head = p_cert_h.add_run("CERTIFICATE")
    r_c_head.bold = True
    r_c_head.font.name = "Times New Roman"
    r_c_head.font.size = Pt(14)

    p_cert_b1 = doc.add_paragraph()
    p_cert_b1.paragraph_format.line_spacing = 1.5
    p_cert_b1.paragraph_format.space_after = Pt(10)
    p_cert_b1.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_b1.add_run("This is to certify that the project report entitled:\n\n")
    r_cb_t = p_cert_b1.add_run('"MUSEO: THE VIRTUAL MUSEUM OF DEEP TIME & EARTH EVOLUTION"\n')
    r_cb_t.bold = True
    r_cb_s = p_cert_b1.add_run("An Interactive 3D WebGL Paleontological & Chrono-Spatial Web Experience\n")
    p_cert_b1.add_run(
        "has been prepared and submitted by Prajapati Dixit K. (Enrollment No.: 236260316028) as a partial fulfillment of the requirement for the subject Software Development of Diploma in IT Engineering, Semester 6th, at Government Polytechnic Palanpur, during the academic year 2025–2026.\n\n"
        "The project has been carried out under my guidance and supervision. To the best of my knowledge and belief, this work is original and has not been submitted to any other institution or university for the award of any certificate or diploma.\n\n"
        "The project fulfills the requirements as per the regulations of this institution, and in my opinion, it meets the necessary standards for submission."
    )

    # Signatures
    p_cert_sigs = doc.add_paragraph()
    p_cert_sigs.paragraph_format.space_before = Pt(36)
    p_cert_sigs.paragraph_format.space_after = Pt(0)
    p_cert_sigs.paragraph_format.line_spacing = 1.3
    
    r_sigs = p_cert_sigs.add_run(
        "Signature of Guide:                                            Head of Department:\n"
        "Prof. Chinkal Khadadiya                                         Department of IT Engineering\n"
        "Professor, Department of IT                                     Govt. Polytechnic Palanpur\n"
        "Govt. Polytechnic Palanpur                                      Date: _______________\n"
        "Date: _______________"
    )
    r_sigs.font.name = "Times New Roman"
    r_sigs.font.size = Pt(11)

    # ==========================================
    # 4. ABSTRACT (Page iii)
    # ==========================================
    doc.add_page_break()
    p_abs_h = doc.add_paragraph()
    p_abs_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs_h.paragraph_format.space_before = Pt(16)
    p_abs_h.paragraph_format.space_after = Pt(16)
    r_abs = p_abs_h.add_run("ABSTRACT")
    r_abs.bold = True
    r_abs.font.name = "Times New Roman"
    r_abs.font.size = Pt(14)

    p_abs_b = doc.add_paragraph()
    p_abs_b.paragraph_format.line_spacing = 1.5
    p_abs_b.paragraph_format.space_after = Pt(10)
    p_abs_b.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs_b.add_run(
        "MUSEO (The Virtual Museum of Deep Time & Earth Evolution) is an award-grade, browser-based digital museum engineered to transform how students and the general public comprehend planetary geology, biological evolution, and ancient cultural heritage. Traditional digital museum platforms are overwhelmingly static, presenting flat two-dimensional photograph galleries accompanied by dense text that fails to communicate the monumental scale of Earth's 4.54-billion-year history.\n\n"
        "MUSEO overcomes these limitations by establishing a revolutionary design philosophy: Time is the primary user interface. Built using Next.js 16 (App Router), React 19, Three.js (r185), React Three Fiber (R3F), Zustand 5, and Tailwind CSS 4, the platform integrates cinematic 3D computer graphics with verified academic literature. The application incorporates seven major functional modules: a Living Museum 3D Admission Kiosk with physics-based ticket passes and wax seal stamping; a continuous 4.54-billion-year 3D Earth Evolution Engine with dynamic continental drift and atmospheric shaders; a real-time cinematic Chicxulub Asteroid Impact cutscene; a Virtual Specimen Archive containing 24 scientifically verified holotypes; an interactive Material Degradation Sandbox simulating centuries of patina and erosion; a zero-asset procedural Web Audio synthesis engine; and a responsive Docent AI guidance system.\n\n"
        "Testing results demonstrate a 98.7% pass rate across 155 test cases, with desktop systems maintaining a rock-solid 60 FPS and mobile devices achieving 48+ FPS under dynamic hardware tiering. On Google Lighthouse, MUSEO earned scores of 94+ Performance, 98+ Accessibility, 100 Best Practices, and 100 SEO. The project successfully proves that educational web software can combine university-grade scientific rigor with international award-level visual craft."
    )

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(16)
    p_kw.paragraph_format.space_after = Pt(0)
    p_kw.paragraph_format.line_spacing = 1.3
    r_kw_lbl = p_kw.add_run("Keywords: ")
    r_kw_lbl.bold = True
    r_kw_lbl.font.name = "Times New Roman"
    r_kw_lbl.font.size = Pt(11)
    r_kw_txt = p_kw.add_run(
        "Next.js 16, React Three Fiber, Three.js, WebGL, Deep Time, Continental Drift, "
        "Draco Compression, Procedural Audio, GSAP, Neo-Brutalism, Paleontology, 3D Museum."
    )
    r_kw_txt.font.name = "Times New Roman"
    r_kw_txt.font.size = Pt(11)

    # ==========================================
    # 5. ACKNOWLEDGEMENT (Page iv)
    # ==========================================
    doc.add_page_break()
    p_ack_h = doc.add_paragraph()
    p_ack_h.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack_h.paragraph_format.space_before = Pt(16)
    p_ack_h.paragraph_format.space_after = Pt(16)
    r_ack = p_ack_h.add_run("ACKNOWLEDGEMENT")
    r_ack.bold = True
    r_ack.font.name = "Times New Roman"
    r_ack.font.size = Pt(14)

    p_ack_b = doc.add_paragraph()
    p_ack_b.paragraph_format.line_spacing = 1.5
    p_ack_b.paragraph_format.space_after = Pt(10)
    p_ack_b.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_ack_b.add_run(
        "I take this opportunity to express my deep sense of gratitude and sincere thanks to all those who have contributed to the successful completion of this project report.\n\n"
        "First and foremost, I extend my heartfelt thanks to my project guide, Prof. Chinkal Khadadiya, Professor, Department of IT Engineering, Government Polytechnic Palanpur, for her constant guidance, valuable suggestions, and encouragement throughout the development of this project. Her constructive feedback and patient support were instrumental in shaping this work into its final form.\n\n"
        "I am sincerely grateful to the Head of the Department of IT Engineering, Government Polytechnic Palanpur, for providing the necessary academic resources, laboratory infrastructure, and encouragement required to undertake this advanced 3D computer graphics and web engineering endeavor.\n\n"
        "I extend my sincere thanks to all the faculty members and staff of the Department of IT Engineering, whose lectures, laboratory sessions, and technical foundation provided the academic grounding required for this work.\n\n"
        "Finally, I acknowledge the invaluable contributions of the global open-source community — the developers of Next.js, Three.js, React Three Fiber, Zustand, GSAP, and the open-access 3D specimen archives of the Smithsonian Institution, Natural History Museum London, and Field Museum Chicago. Their open research and datasets made this virtual heritage platform possible."
    )

    p_ack_sig = doc.add_paragraph()
    p_ack_sig.paragraph_format.space_before = Pt(24)
    p_ack_sig.paragraph_format.space_after = Pt(0)
    p_ack_sig.paragraph_format.line_spacing = 1.3
    p_ack_sig.add_run(
        "Place: Palanpur\n"
        "Date: _______________\n\n"
        "Prajapati Dixit K.\n"
        "Enrollment No.: 236260316028\n"
        "6th Semester, IT Department"
    )

    print("Preliminary front matter assembled.")
