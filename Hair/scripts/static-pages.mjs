import { copyFile, mkdir, writeFile } from 'node:fs/promises';

for (const route of ['about', 'gallery']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
await writeFile('dist/.nojekyll', '');
