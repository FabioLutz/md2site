import markdownIt from 'markdown-it';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const scriptDir = path.dirname(url.fileURLToPath(import.meta.url));
const rootPath = path.dirname(scriptDir);
const markdownPath = path.join(rootPath, 'markdown');
const publicDir = path.join(rootPath, 'public');

const markdownFile = path.join(markdownPath, 'file.md');
const outputFile = path.join(publicDir, 'index.html');

const markdownContent = fs.readFileSync(markdownFile, 'utf8');

const htmlContent = markdownIt().render(markdownContent);

fs.writeFileSync(outputFile, htmlContent, 'utf8');
