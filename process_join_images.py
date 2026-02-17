import os
import re
import shutil

source_dir = r"c:\Users\daksh\Downloads\temp-website\frontend\join-zip"
target_dir = r"c:\Users\daksh\Downloads\temp-website\frontend\public\join"

# Create target directory
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

# Pattern to extract frame number
# Matches frame_000_delay... or similar
pattern = re.compile(r"frame_(\d+)_")

files = os.listdir(source_dir)
files.sort()

count = 0
for filename in files:
    if not filename.endswith(".jpg"):
        continue

    match = pattern.search(filename)
    if match:
        frame_num = int(match.group(1))
        # New name: 000.jpg, 001.jpg, etc.
        new_name = f"{frame_num:03d}.jpg"
        
        src_path = os.path.join(source_dir, filename)
        dst_path = os.path.join(target_dir, new_name)
        
        shutil.copy2(src_path, dst_path)
        print(f"Moved {filename} -> {new_name}")
        count += 1

print(f"Successfully processed {count} images.")
