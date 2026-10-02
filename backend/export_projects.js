const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const db = new Database(path.join(__dirname, 'db.sqlite'));
const projects = db.prepare('SELECT * FROM projects').all();
for (const p of projects) {
  p.images = db.prepare('SELECT id, imageUrl, "order", isCover FROM project_images WHERE projectId = ?').all(p.id);
  // Ensure URLs are relative
  if (p.thumbnailUrl && p.thumbnailUrl.startsWith('http')) {
    p.thumbnailUrl = p.thumbnailUrl.replace(/^https?:\/\/[^\/]+/, '');
  }
  if (p.images) {
    p.images.forEach(img => {
      if (img.imageUrl && img.imageUrl.startsWith('http')) {
        img.imageUrl = img.imageUrl.replace(/^https?:\/\/[^\/]+/, '');
      }
      img.isCover = Boolean(img.isCover);
    });
  }
}

console.log('Found ' + projects.length + ' projects:');
for (const p of projects) {
  console.log('- [ID: ' + p.id + '] ' + p.title + ' | CubeIndex: ' + p.cubeIndex + ' | Thumbnail: ' + p.thumbnailUrl);
}

const outDir = path.join(__dirname, '..', 'frontend', 'src', 'app', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Write JSON
const jsonPath = path.join(outDir, 'projects-data.json');
fs.writeFileSync(jsonPath, JSON.stringify(projects, null, 2));

// Write TypeScript file
const tsPath = path.join(outDir, 'projects-data.ts');
const tsContent = `// Auto-generated fallback project dataset for static / serverless deployments (e.g. Vercel)
import { Project } from '../services/project.service';

export const FALLBACK_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};
`;
fs.writeFileSync(tsPath, tsContent);
console.log('Saved JSON to:', jsonPath);
console.log('Saved TS to:', tsPath);
