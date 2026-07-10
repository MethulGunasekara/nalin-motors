import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Renders a DOM node (the print-sheet) to a single-page A4 PDF and triggers a download.
 * @param {HTMLElement} node - the element to capture (ref to .print-sheet)
 * @param {string} filename - e.g. "service-card-WP-CAB-1234.pdf"
 */
export const downloadServiceCardPdf = async (node, filename) => {
  const canvas = await html2canvas(node, {
    scale: 2, // sharper output for text-heavy content
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');

  // A4 in mm
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale the captured image to fit the page width, preserving aspect ratio
  const imgWidth = pageWidth - 20; // 10mm margin each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10; // top margin

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  // If content overflows one A4 page (long checklist + notes), add extra pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save(filename);
};