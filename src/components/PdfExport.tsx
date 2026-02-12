import { FileDown } from 'lucide-react';
import styles from './PdfExport.module.css';

interface PdfExportProps {
  url: string;
}

export function PdfExport({ url }: PdfExportProps) {
  const handleExport = () => {
    // Set a data attribute so print styles can use it
    document.documentElement.setAttribute('data-printing', 'true');
    document.title = `AI Visibility Report - ${url}`;

    // Small delay to let styles apply
    requestAnimationFrame(() => {
      window.print();
      // Clean up after print dialog closes
      const cleanup = () => {
        document.documentElement.removeAttribute('data-printing');
        document.title = 'AI Visibility Checker';
      };
      // Use onafterprint where supported, otherwise timeout
      if ('onafterprint' in window) {
        window.addEventListener('afterprint', cleanup, { once: true });
      } else {
        setTimeout(cleanup, 1000);
      }
    });
  };

  return (
    <button onClick={handleExport} className={styles.exportBtn}>
      <FileDown size={16} />
      <span>Download PDF report</span>
    </button>
  );
}
