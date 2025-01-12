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

const templateFile = path.join(paths.template, 'template.html');
const markdownFiles = fs.readdirSync(paths.markdown);

markdownFiles.forEach(file => {
    const content = fs.readFileSync(paths.markdown + '/' + file, 'utf8');
    const htmlContent = markdownIt().render(content);

    const posicao = file.lastIndexOf('.');
    const fileName = (posicao !== -1 ? file.substring(0, posicao) : file);
    
    const replacements = {
        title: 'Título',
        content: htmlContent,
    };
    
    const templateContent = fs.readFileSync(templateFile, 'utf8');
    
    const finalHtml = templateContent.replace(
        /{{(\w+)}}/g,
        (match, placeholder) => replacements[placeholder] || match
    );
    
    fs.writeFileSync(
        paths.public + '/' + fileName + '.html',
        finalHtml,
        'utf8'
    );
});
