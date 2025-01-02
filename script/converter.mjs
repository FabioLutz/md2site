import markdownIt from 'markdown-it';

const markdownContent = `
# Texto markdown

Texto com **negrito** e _itálico_.
`;

const htmlContent = markdownIt().render(markdownContent);

console.log(htmlContent);