import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RiskAllele } from '../data/RiskAlleles';

export interface DetectedRisk {
    riskInfo: RiskAllele;
    userGenotype: string;
    matchType: 'HO' | 'HE';
}

export const generateRiskPDF = (risks: DetectedRisk[], snpCount: number, source: string) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // --- Header ---
    // Brand Color Strip
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("Genetic Analyzer Report", 15, 13);

    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, 195, 13, { align: 'right' });

    // --- Summary Section ---
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Analysis Summary", 15, 35);

    const highRisks = risks.filter(r => r.matchType === 'HO').length;
    const mediumRisks = risks.filter(r => r.matchType === 'HE').length;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Source File: ${source}`, 15, 45);
    doc.text(`Total SNPs Analyzed: ${snpCount.toLocaleString()}`, 15, 50);

    doc.text(`High Impact Risks Detected: ${highRisks}`, 15, 60);
    doc.text(`Medium Impact Risks Detected: ${mediumRisks}`, 15, 65);

    // --- Detailed Risks Table ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Detailed Risk Findings", 15, 80);

    const tableData = risks.map(r => [
        r.riskInfo.condition,
        r.riskInfo.category,
        r.matchType === 'HO' ? 'High' : 'Medium',
        r.userGenotype,
        r.riskInfo.gene,
        r.riskInfo.description
    ]);

    autoTable(doc, {
        startY: 85,
        head: [['Condition', 'Category', 'Impact', 'Genotype', 'Gene', 'Description']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 30 },
            5: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        didParseCell: (data) => {
            // Color code the Impact column
            if (data.section === 'body' && data.column.index === 2) {
                if (data.cell.raw === 'High') {
                    data.cell.styles.textColor = [220, 38, 38]; // Red
                    data.cell.styles.fontStyle = 'bold';
                } else {
                    data.cell.styles.textColor = [217, 119, 6]; // Amber
                }
            }
        }
    });

    // --- Footer ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('This report is for informational purposes only and is not a medical diagnosis.', 105, 290, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
    }

    doc.save(`Genetic_Report_${date.replace(/\//g, '-')}.pdf`);
};
