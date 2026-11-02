import docx

doc = docx.Document(r"docs\MUSEO_ACADEMIC_PROJECT_REPORT.docx")
page_breaks = 0
for p in doc.paragraphs:
    if 'type="page"' in p._p.xml:
        page_breaks += 1
print(f"Explicit page breaks: {page_breaks}")
print(f"Total paragraphs: {len(doc.paragraphs)}")
print(f"Total tables: {len(doc.tables)}")
print(f"Total inline shapes: {len(doc.inline_shapes)}")
