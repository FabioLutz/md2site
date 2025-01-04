import markdownIt from 'markdown-it';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const rootPath = path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '..'
);

const paths = {
    script: path.join(rootPath, 'script'),
    markdown: path.join(rootPath, 'markdown'),
    public: path.join(rootPath, 'public'),
};

const markdownFile = path.join(paths.markdown, 'file.md');
const outputFile = path.join(paths.public, 'index.html');

const markdownContent = fs.readFileSync(markdownFile, 'utf8');

const htmlContent = markdownIt().render(markdownContent);

fs.writeFileSync(outputFile, htmlContent, 'utf8');
