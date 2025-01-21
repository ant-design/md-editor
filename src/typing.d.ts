declare module 'html2pdf.js';
declare module 'html-to-pdfmake';
declare module 'pdfmake';
declare module 'direction' {
  function direction(text: string): 'neutral' | 'ltr' | 'rtl';
  export default direction;
}
