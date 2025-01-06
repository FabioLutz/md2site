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
    template: path.join(rootPath, 'template'),
};

const markdownFile = path.join(paths.markdown, 'file.md');
const outputFile = path.join(paths.public, 'index.html');
const templateFile = path.join(paths.template, 'template.html');

const markdownContent = fs.readFileSync(markdownFile, 'utf8');

const htmlContent = markdownIt().render(markdownContent);

const replacements = {
    title: 'Título',
    content: htmlContent,
};

const templateContent = fs.readFileSync(templateFile, 'utf8');

const finalHtml = templateContent.replace(/{{(\w+)}}/g, (match, placeholder) => replacements[placeholder] || match);

fs.writeFileSync(outputFile, finalHtml, 'utf8');
