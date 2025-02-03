import katex from 'katex';
import md from 'markdown-it';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const markdownIt = new md({
    html: true,
});

const rootPath = path.join(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '..'
);

const paths = {
    script: path.join(rootPath, 'script'),
    configFile: path.join(rootPath, 'config.json'),

    markdown: path.join(rootPath, 'markdown'),
    image: path.join(rootPath, 'markdown', 'image'),

    template: path.join(rootPath, 'template'),
    templateStyle: path.join(rootPath, 'template', 'style'),
    templateFavicon: path.join(rootPath, 'template', 'favicon'),

    katexJs: path.join(rootPath, 'node_modules', 'katex', 'dist', 'katex.min.js'),
    katexCss: path.join(rootPath, 'node_modules', 'katex', 'dist', 'katex.min.css'),

    static: path.join(rootPath, 'static-html'),
    staticStyle: path.join(rootPath, 'static-html', 'style'),
    staticFavicon: path.join(rootPath, 'static-html', 'favicon'),

    public: path.join(rootPath, 'public'),

    publicStyle: path.join(rootPath, 'public', 'style'),
    publicFavicon: path.join(rootPath, 'public', 'favicon'),
    publicImage: path.join(rootPath, 'public', 'image'),

    publicTemplateStyle: path.join(rootPath, 'public', 'style', 'template'),
    publicTemplateFavicon: path.join(rootPath, 'public', 'favicon', 'template'),

    publicKatexJs: path.join(rootPath, 'public', 'node_modules', 'katex', 'dist', 'katex.min.js'),
    publicKatexCss: path.join(rootPath, 'public', 'node_modules', 'katex', 'dist', 'katex.min.css'),
};

const configContent = fs.readFileSync(paths.configFile);
const config = JSON.parse(configContent.toString());

function copyFiles(src, dest) {
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
    }
}

copyFiles(paths.templateStyle, paths.publicTemplateStyle);
copyFiles(paths.templateFavicon, paths.publicTemplateFavicon);
copyFiles(paths.image, paths.publicImage);
copyFiles(paths.static, paths.public);
copyFiles(paths.staticStyle, paths.publicStyle);
copyFiles(paths.staticFavicon, paths.publicFavicon);
copyFiles(paths.katexJs, paths.publicKatexJs);
copyFiles(paths.katexCss, paths.publicKatexCss);

function renderLatex(content) {
    const inlineRegex = /<div class="latex-inline">(.*?)<\/div>/g;
    const blockRegex = /<div class="latex-block">(.*?)<\/div>/gs;

    content = content.replace(inlineRegex, (_, equation) => katex.renderToString(
        equation.trim(),
        {
            displayMode: false,
            output: 'html',
        }
    )
    );

    content = content.replace(blockRegex, (_, equation) => katex.renderToString(
        equation.trim(),
        {
            displayMode: true,
            output: 'html',
        }
    )
    );

    return content;
}

config.pages.forEach(page => {
    const markdownFile = path.join(paths.markdown, page.file);
    const templateFile = path.join(paths.template, page.template);
    const outputFile = path.join(paths.public, page.output);

    const plainTextContent = fs.readFileSync(markdownFile, 'utf8');
    const pureHtml = markdownIt.render(plainTextContent);

    const htmlContent = renderLatex(pureHtml);

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
