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
    public: path.join(rootPath, 'public'),
    template: path.join(rootPath, 'template'),
};

const configContent = fs.readFileSync(paths.configFile);
const config = JSON.parse(configContent.toString());

config.pages.forEach(page => {
    const markdownFile = path.join(paths.markdown, page.file);
    const templateFile = path.join(paths.template, page.template);
    const outputFile = path.join(paths.public, page.output);

    const content = fs.readFileSync(markdownFile, 'utf8');
    const htmlContent = markdownIt().render(content);

    const replacements = {
        title: page.title,
        content: htmlContent,
    };
    
    const templateContent = fs.readFileSync(templateFile, 'utf8');
    
    const finalHtml = templateContent.replace(
        /{{(\w+)}}/g,
        (match, placeholder) => replacements[placeholder] || match
    );
    
    fs.writeFileSync(outputFile, finalHtml, 'utf8');
});
