import fs from 'fs';
import path from 'path';

const sourceDir = 'frontend/books-zip';
const targetDir = 'frontend/public/books';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error("Error reading source directory:", err);
        return;
    }

    // Filter for jpg files and sort them to ensure correct order
    const jpgFiles = files.filter(file => file.endsWith('.jpg')).sort();

    jpgFiles.forEach((file, index) => {
        const ext = path.extname(file);
        // Pad index to 3 digits (e.g., 001.jpg)
        const newName = `${String(index + 1).padStart(3, '0')}${ext}`;
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, newName);

        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${file} to ${newName}`);
    });

    console.log(`Processed ${jpgFiles.length} files.`);
});
