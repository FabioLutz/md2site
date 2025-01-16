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
    configFile: path.join(rootPath, 'config.json'),
    markdown: path.join(rootPath, 'markdown'),
    template: path.join(rootPath, 'template'),
    style: path.join(rootPath, 'template', 'style'),
    public: path.join(rootPath, 'public'),
    publicStyle: path.join(rootPath, 'public', 'style'),
};

const configContent = fs.readFileSync(paths.configFile);
const config = JSON.parse(configContent.toString());

function copyFiles(src, dest) {
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
    }
}

copyFiles(paths.style, paths.publicStyle);

config.pages.forEach(page => {
    const markdownFile = path.join(paths.markdown, page.file);
    const templateFile = path.join(paths.template, page.template);
    const outputFile = path.join(paths.public, page.output);

    const content = fs.readFileSync(markdownFile, 'utf8');
    const htmlContent = markdownIt().render(content);

    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const basePath = path.relative(outputDir, paths.public);

    const replacements = {
        title: page.title,
        content: htmlContent,
        basePath: basePath ? `${basePath}` : '.',
    };
    
    const templateContent = fs.readFileSync(templateFile, 'utf8');
    
    const finalHtml = templateContent.replace(
        /{{(\w+)}}/g,
        (match, placeholder) => replacements[placeholder] || match
    );
    
    fs.writeFileSync(outputFile, finalHtml, 'utf8');
});
