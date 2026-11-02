"""
MUSEO Academic Project Report - Master Orchestrator (.docx)
Strictly adheres to GTU Diploma IT Engineering specifications and the official
Government Polytechnic Palanpur sample report format (media_1792682990532_ddb6d5f7.pdf):
- Paper: A4 (8.27 x 11.69 in)
- Margins: Left 3.81 cm (1.5 in), Right 2.54 cm (1.0 in), Top 2.54 cm (1.0 in), Bottom 2.54 cm (1.0 in)
- Typography: Times New Roman, 12 pt, 1.5 line spacing, pure black text
- Chapter headings: 16 pt, bold, centered
- Section headings: 14 pt, bold, UPPERCASE, left-aligned
- Subsection headings: 12 pt, bold, UPPERCASE, left-aligned
- Table Captions: Placed BELOW tables
- Figure Captions: Centered with Figure number bold, followed by analytical description
- Pagination: Bottom-center Roman numerals for preliminaries (i-viii), Arabic (1-N) for body
- Page count: Target strictly within 60–100 pages
"""

import os
import sys
import time
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Import modular builder sections
from build_preliminaries import add_preliminary_pages
from build_toc_and_lists import add_toc_and_lists
from build_chapters_1_to_6 import add_chapters_1_to_6
from build_chapter_7 import add_chapter_7
from build_chapter_8_and_appendices import add_chapter_8_and_appendices

# Absolute Paths
BASE_DIR = r"c:\Users\DELL\Documents\museverse\docs"
DOCX_OUTPUT_PATH = os.path.join(BASE_DIR, "MUSEO_ACADEMIC_PROJECT_REPORT.docx")
ASSETS_DIR = os.path.join(BASE_DIR, "report_assets")
LOGO_PATH = os.path.join(BASE_DIR, "Image23.jpg")

print(f"Initializing master report generation at {DOCX_OUTPUT_PATH}...")
start_time = time.time()

doc = docx.Document()

# ==========================================
# 1. SECTION 1 CONFIGURATION (PRELIMINARIES)
# ==========================================
s1 = doc.sections[0]
s1.page_width = Inches(8.27)
s1.page_height = Inches(11.69)
s1.top_margin = Inches(1.0)
s1.bottom_margin = Inches(1.0)
s1.left_margin = Inches(1.5)   # 3.81 cm
s1.right_margin = Inches(1.0)  # 2.54 cm

# Unlink first page (Title page has no header/footer)
s1.different_first_page_header_footer = True

# Preliminary footer with Roman numerals at bottom-center
s1_footer = s1.footer
p1_foot = s1_footer.paragraphs[0]
p1_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
fld1 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
p1_foot._p.append(fld1)

pgNumType1 = parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman" w:start="1"/>')
s1._sectPr.append(pgNumType1)

# Default Normal Typography Style: Times New Roman, 12 pt, 1.5 line spacing, pure black
normal_style = doc.styles['Normal']
normal_style.font.name = 'Times New Roman'
normal_style.font.size = Pt(12)
normal_style.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
normal_style.paragraph_format.line_spacing = 1.5
normal_style.paragraph_format.space_after = Pt(6)
normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

# ==========================================
# HELPER STYLING FUNCTIONS
# ==========================================
def set_cell_background(cell, fill_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_borders(table, color="A0A0A0"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="{color}"/>
            <w:bottom w:val="single" w:sz="8" w:space="0" w:color="{color}"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

first_body_chapter = [True]

def add_chapter_heading(doc, text):
    if not first_body_chapter[0]:
        doc.add_page_break()
    else:
        first_body_chapter[0] = False
        
    p = doc.add_paragraph()
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(14)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(16)
    run.bold = True
    run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    return p

def add_section_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text.upper())
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.bold = True
    run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    return p

def add_subsection_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text.upper())
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.bold = True
    run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    return p

def add_subsubsection_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.bold = True
    run.italic = True
    run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    return p

def add_styled_table(doc, headers, rows, col_widths=None, table_title=None):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)

    # Format Header Row: light grey background, bold black text
    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_background(hdr_cells[i], "F2F2F2")
        set_cell_margins(hdr_cells[i], 100, 100, 120, 120)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        for run in p.runs:
            run.font.name = 'Times New Roman'
            run.font.size = Pt(10.5)
            run.bold = True
            run.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    # Format Data Rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = "FAFAFA" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            row_cells[c_idx].text = str(cell_value)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], 60, 60, 100, 100)
            p = row_cells[c_idx].paragraphs[0]
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            for run in p.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)

    # Set column widths if provided
    if col_widths:
        for row in table.rows:
            for c_idx, width in enumerate(col_widths):
                row.cells[c_idx].width = Inches(width)

    # Table Title placed BELOW the table (per official sample report format)
    if table_title:
        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_before = Pt(4)
        p_title.paragraph_format.space_after = Pt(8)
        p_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p_title.add_run(table_title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.bold = True
        r.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

def add_code_block(doc, code_text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_background(cell, "F8F8F8")
    set_cell_margins(cell, 80, 80, 140, 140)
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
            <w:left w:val="single" w:sz="14" w:space="0" w:color="333333"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
        </w:tcBorders>
    ''')
    cell._tc.get_or_add_tcPr().append(borders)
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(0)
    p_space.paragraph_format.space_after = Pt(4)

def add_figure_with_image(doc, rel_path, fig_num_str, title_str, description_str, width_in=4.1):
    img_full_path = os.path.join(ASSETS_DIR, rel_path)
    if os.path.exists(img_full_path):
        p_img = doc.add_paragraph()
        p_img.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(2)
        run_img = p_img.add_run()
        run_img.add_picture(img_full_path, width=Inches(width_in))

        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(2)
        p_cap.paragraph_format.keep_with_next = True
        
        r_num = p_cap.add_run(f"Figure {fig_num_str}: ")
        r_num.bold = True
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(10.5)
        r_num.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

        r_title = p_cap.add_run(title_str)
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(10.5)
        r_title.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

        if description_str:
            p_desc = doc.add_paragraph()
            p_desc.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p_desc.paragraph_format.space_before = Pt(0)
            p_desc.paragraph_format.space_after = Pt(8)
            p_desc.paragraph_format.line_spacing = 1.25
            r_desc = p_desc.add_run(description_str)
            r_desc.font.name = 'Times New Roman'
            r_desc.font.size = Pt(10)
            r_desc.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

# ==========================================
# 2. GENERATE PRELIMINARY PAGES
# ==========================================
print("1/5: Building preliminary pages (Title, Declaration, Certificate, Abstract, Acknowledgement)...")
add_preliminary_pages(doc, LOGO_PATH)

# ==========================================
# 3. GENERATE TOC, LOT, LOF, LOA
# ==========================================
print("2/5: Building Table of Contents, List of Figures, List of Tables, List of Acronyms...")
add_toc_and_lists(doc, add_styled_table)

# ==========================================
# 4. SECTION 2 CONFIGURATION (BODY & APPENDICES)
# ==========================================
print("3/5: Initializing Section 2 (Body Chapters 1 to 8, References, Appendices)...")
s2 = doc.add_section()
s2.page_width = Inches(8.27)
s2.page_height = Inches(11.69)
s2.top_margin = Inches(1.0)
s2.bottom_margin = Inches(1.0)
s2.left_margin = Inches(1.5)   # 3.81 cm
s2.right_margin = Inches(1.0)  # 2.54 cm

# Unlink Section 2 from Section 1
s2.footer.is_linked_to_previous = False
s2.header.is_linked_to_previous = False

# No running top header (matches sample report)

# Running footer for body: Arabic numerals starting at 1 at bottom-center
s2_footer = s2.footer
p2_foot = s2_footer.paragraphs[0]
p2_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
fld2 = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
p2_foot._p.append(fld2)

pgNumType2 = parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>')
s2._sectPr.append(pgNumType2)

# ==========================================
# 5. ASSEMBLE CHAPTERS 1 TO 6
# ==========================================
print("4/5: Compiling Chapters 1 through 6 (Introduction, Overview, Architecture, Modules, Implementation, Testing)...")
add_chapters_1_to_6(doc, add_chapter_heading, add_section_heading, add_subsection_heading, 
                    add_subsubsection_heading, add_styled_table, add_code_block)

# ==========================================
# 6. ASSEMBLE CHAPTER 7 (VISUAL RESULTS & TELEMETRY)
# ==========================================
print("5/5 (a): Compiling Chapter 7 with 58 primary figures and analytical documentation...")
add_chapter_7(doc, add_chapter_heading, add_section_heading, add_subsection_heading, 
              add_figure_with_image, add_styled_table)

# ==========================================
# 7. ASSEMBLE CHAPTER 8, REFERENCES & APPENDICES
# ==========================================
print("5/5 (b): Compiling Chapter 8 (Conclusion), References, and Appendices A through F...")
add_chapter_8_and_appendices(doc, add_chapter_heading, add_section_heading, add_subsection_heading, 
                             add_subsubsection_heading, add_styled_table, add_code_block)

# ==========================================
# 8. SAVE DOCUMENT
# ==========================================
print(f"Saving finalized academic report to {DOCX_OUTPUT_PATH}...")
doc.save(DOCX_OUTPUT_PATH)

elapsed = time.time() - start_time
file_size_mb = os.path.getsize(DOCX_OUTPUT_PATH) / (1024 * 1024)
print("=" * 60)
print(f"SUCCESS! MUSEO Academic Project Report generated in {elapsed:.2f} seconds.")
print(f"File Size: {file_size_mb:.2f} MB")
print(f"Location: {DOCX_OUTPUT_PATH}")
print("=" * 60)
