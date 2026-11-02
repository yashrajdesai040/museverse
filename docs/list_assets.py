import os
import json
from PIL import Image

manifest_path = r"c:\Users\DELL\Documents\museverse\docs\report_assets\manifest.json"
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

print(f"Total entries in manifest: {len(manifest['files'])}")
valid_count = 0
for entry in manifest["files"]:
    rel_path = entry["archivePath"]
    full_path = os.path.join(r"c:\Users\DELL\Documents\museverse\docs\report_assets", rel_path)
    exists = os.path.exists(full_path)
    if exists:
        valid_count += 1
        im = Image.open(full_path)
        if valid_count <= 5:
            print(f"OK: {entry['id']} -> {rel_path} ({im.size}) - {entry['title']}")
    else:
        print(f"MISSING: {full_path}")

print(f"Verified {valid_count} existing image files out of {len(manifest['files'])}")
