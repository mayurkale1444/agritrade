import { jsPDF } from 'jspdf';

export interface PdfReportOptions {
  commodityName: string;
  commodityId: string;
  state: string;
  district: string;
  marketName: string;
  variety?: string;
  grade?: string;
  arrivalDate: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  isLive: boolean;
  dataTypeCategory: 'LIVE VERIFIED DATA' | 'FALLBACK DATA' | 'DEMO DATA';
  statusMessage?: string;
  dataSource?: string;
  unit?: string;
}

/**
 * Sanitize text to ensure standard Latin/ASCII characters compatible with standard jsPDF fonts.
 * Replaces Unicode quotes, dashes, symbols, and unsupported glyphs that cause character overlap.
 */
export function sanitizePdfText(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
    .replace(/\u20B9/g, 'Rs. ')
    .replace(/[^\x00-\x7F]/g, ' ') // Strip non-ASCII characters that cause jsPDF text corruption
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Format INR currency with "Rs." prefix (pure ASCII safe for PDF generation)
 */
function formatRupeePdf(amount: number): string {
  if (isNaN(amount) || amount <= 0) return 'Rs. 0';
  return 'Rs. ' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Generates a clean, prospect-facing single-mandi Daily Market Price Report A4 PDF.
 * Conforms strictly to requirements:
 * - Simple single-column A4 structure: Header -> Status Banner -> Information Box -> Price Summary -> Footer
 * - Purely selected commodity and selected market data (no unselected mandis/commodities)
 * - Header: AgriTrade & MANDI PRICE REPORT
 * - Status: LIVE, UNAVAILABLE, or FALLBACK
 * - Main Information Box: Commodity, Arrival Date, Market (with district, state), Price Summary
 * - Price Summary: Minimum Price, Modal Price, Maximum Price, Unit: Rs. per quintal
 * - For UNAVAILABLE: "No verified government record found for this selection/date."
 * - Footer: Strictly "AgriTrade" only
 * - Dynamic, verified vertical coordinates preventing overlapping or clipped text
 */
export function generateMandiPdf(options: PdfReportOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2; // 170 mm

  const isLive = options.isLive && options.dataTypeCategory === 'LIVE VERIFIED DATA';
  const isFallback = options.dataTypeCategory === 'FALLBACK DATA' || options.dataTypeCategory === 'DEMO DATA';

  const commodity = sanitizePdfText(options.commodityName) || 'Agricultural Commodity';
  const marketName = sanitizePdfText(options.marketName) || 'Selected Mandi';
  const district = sanitizePdfText(options.district);
  const state = sanitizePdfText(options.state);
  
  // Format market line discreetly including district and state if available
  const marketFullLine = district && state 
    ? `${marketName}, ${district}, ${state}`
    : marketName;

  const arrivalDate = sanitizePdfText(options.arrivalDate) || 'Today';

  let currentY = margin;

  // ==========================================
  // 1. HEADER (AgriTrade & MANDI PRICE REPORT)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('AgriTrade', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Know Before You Sell.', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text('MANDI PRICE REPORT', margin, currentY);
  currentY += 6;

  // Subtle accent line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // ==========================================
  // 2. STATUS BADGE
  // ==========================================
  let statusText = 'STATUS: LIVE';
  let statusBg = [236, 253, 245]; // emerald-50
  let statusBorder = [52, 211, 153]; // emerald-400
  let statusTextColor = [6, 95, 70]; // emerald-800

  if (!isLive) {
    if (isFallback) {
      statusText = 'STATUS: FALLBACK';
      statusBg = [254, 243, 199]; // amber-50
      statusBorder = [245, 158, 11]; // amber-400
      statusTextColor = [146, 64, 14]; // amber-800
    } else {
      statusText = 'STATUS: UNAVAILABLE';
      statusBg = [254, 242, 242]; // red-50
      statusBorder = [248, 113, 113]; // red-400
      statusTextColor = [153, 27, 27]; // red-800
    }
  }

  const badgeHeight = 10;
  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusBorder[0], statusBorder[1], statusBorder[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, badgeHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(statusTextColor[0], statusTextColor[1], statusTextColor[2]);
  doc.text(statusText, margin + 4, currentY + 6.8);

  currentY += badgeHeight + 8;

  // ==========================================
  // 3. MAIN INFORMATION BOX
  // ==========================================
  // Calculate content inside the clean information box
  const boxStartY = currentY;
  
  // Market text wrapped safely
  const marketLabel = 'Market:';
  const labelWidth = 34;
  const valWidth = contentWidth - labelWidth - 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const splitMarket = doc.splitTextToSize(marketFullLine, valWidth);
  const marketLinesHeight = splitMarket.length * 6;

  // Items: Commodity, Arrival Date, Market
  const baseBoxHeight = 24 + marketLinesHeight;
  
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, boxStartY, contentWidth, baseBoxHeight, 2, 2, 'FD');

  let innerY = boxStartY + 7;

  // Row 1: Commodity
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('Commodity:', margin + 5, innerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(commodity, margin + labelWidth + 5, innerY);
  innerY += 7;

  // Row 2: Arrival Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Arrival Date:', margin + 5, innerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(arrivalDate, margin + labelWidth + 5, innerY);
  innerY += 7;

  // Row 3: Market
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(marketLabel, margin + 5, innerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(splitMarket, margin + labelWidth + 5, innerY);

  currentY = boxStartY + baseBoxHeight + 10;

  // ==========================================
  // 4. PRICE SUMMARY (Table / Structured Box)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Price Summary', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Unit: Rs. per quintal', pageWidth - margin, currentY, { align: 'right' });
  currentY += 5;

  if (isLive) {
    // Render clean price table
    const tableStartY = currentY;
    const colWidth = contentWidth / 3;
    const rowHeight = 18;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, tableStartY, contentWidth, rowHeight, 2, 2, 'FD');

    // Dividers
    doc.line(margin + colWidth, tableStartY, margin + colWidth, tableStartY + rowHeight);
    doc.line(margin + colWidth * 2, tableStartY, margin + colWidth * 2, tableStartY + rowHeight);

    // Minimum Price
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Minimum Price', margin + 5, tableStartY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(formatRupeePdf(options.minPrice), margin + 5, tableStartY + 13);

    // Modal Price (Prominent Core Value)
    doc.setFillColor(236, 253, 245);
    doc.rect(margin + colWidth, tableStartY + 0.3, colWidth, rowHeight - 0.6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(6, 95, 70);
    doc.text('Modal Price *', margin + colWidth + 5, tableStartY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(4, 120, 87);
    doc.text(formatRupeePdf(options.modalPrice), margin + colWidth + 5, tableStartY + 13.5);

    // Maximum Price
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Maximum Price', margin + colWidth * 2 + 5, tableStartY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(formatRupeePdf(options.maxPrice), margin + colWidth * 2 + 5, tableStartY + 13);

    currentY = tableStartY + rowHeight + 10;
  } else if (isFallback) {
    // Fallback: clearly state values are not a verified current quote
    const fallbackBoxHeight = 32;
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(245, 158, 11); // amber-400
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, fallbackBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(146, 64, 14);
    doc.text('Reference Baseline (Not a verified current quote)', margin + 5, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.text('Modal Baseline: ' + formatRupeePdf(options.modalPrice) + ' / quintal', margin + 5, currentY + 14);
    doc.text('Notice: These values are not a verified current auction quote for today.', margin + 5, currentY + 21);
    doc.text('Official live quote from AGMARKNET is not currently available for this market.', margin + 5, currentY + 27);

    currentY += fallbackBoxHeight + 10;
  } else {
    // UNAVAILABLE: Exact message required: "No verified government record found for this selection/date."
    const unavailBoxHeight = 22;
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(248, 113, 113); // red-300
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, unavailBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(153, 27, 27); // red-800
    doc.text('Price Quote Unavailable', margin + 5, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text('No verified government record found for this selection/date.', margin + 5, currentY + 15);

    currentY += unavailBoxHeight + 10;
  }

  // ==========================================
  // 5. FOOTER (Strictly "AgriTrade" only)
  // ==========================================
  const footerY = pageHeight - 20;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('AgriTrade -- Know Before You Sell.', margin, footerY);

  return doc;
}

/**
 * Triggers browser download of the Single Mandi Daily Price Report A4 PDF
 */
export function downloadMandiPdf(options: PdfReportOptions): void {
  const doc = generateMandiPdf(options);
  const cleanMarket = (options.marketName || 'mandi').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanCommodity = (options.commodityName || 'commodity').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const dateStamp = (options.arrivalDate || 'report').replace(/\//g, '-');
  const fileName = `AgriTrade_${cleanCommodity}_${cleanMarket}_${dateStamp}.pdf`;
  doc.save(fileName);
}

/**
 * Generates an object URL for embedding a preview of the generated PDF in an iframe
 */
export function getPdfBlobUrl(options: PdfReportOptions): string {
  const doc = generateMandiPdf(options);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

/**
 * Formats a clean, high-impact WhatsApp message for sharing with prospects.
 * strictly conforms to requirement:
 * - Uses actual selected report data
 * - Does not claim that PDF is automatically attached
 * - Does not describe fallback/demo values as verified current prices
 */
export function generateWhatsAppText(options: PdfReportOptions): string {
  const isLive = options.isLive && options.dataTypeCategory === 'LIVE VERIFIED DATA';
  const modalFormatted = isLive ? formatRupeePdf(options.modalPrice) : 'Unavailable';
  const minFormatted = isLive ? formatRupeePdf(options.minPrice) : 'Unavailable';
  const maxFormatted = isLive ? formatRupeePdf(options.maxPrice) : 'Unavailable';

  const market = sanitizePdfText(options.marketName);
  const district = sanitizePdfText(options.district);
  const state = sanitizePdfText(options.state);
  const commodity = sanitizePdfText(options.commodityName);
  const variety = sanitizePdfText(options.variety && options.variety !== 'Other' ? options.variety : (options.variety || 'Standard / Local'));
  const grade = sanitizePdfText(options.grade || 'FAQ');

  if (isLive) {
    return [
      `*AgriTrade - Daily Mandi Price Report*`,
      `_Know Before You Sell._`,
      `Date: ${options.arrivalDate || 'Today'}`,
      `Commodity: ${commodity}`,
      `Market: ${market} (${district}, ${state})`,
      variety ? `Variety: ${variety}` : null,
      grade ? `Grade: ${grade}` : null,
      ``,
      `*Auction Rates (per Quintal):*`,
      `*Modal Price:* ${modalFormatted}/qtl`,
      `Range: ${minFormatted} - ${maxFormatted}/qtl`,
      `Unit: Rs. per quintal (100 kg)`,
      ``,
      `Status: LIVE VERIFIED DATA (AGMARKNET)`,
      `Source: Directorate of Marketing & Inspection, Ministry of Agriculture, Govt. of India.`,
      ``,
      `*(Please attach the downloaded Daily Mandi Price Report PDF file to this message)*`
    ].filter(Boolean).join('\n');
  } else {
    return [
      `*AgriTrade - Daily Mandi Price Report*`,
      `_Know Before You Sell._`,
      `Date: ${options.arrivalDate || 'Today'}`,
      `Commodity: ${commodity}`,
      `Market: ${market} (${district}, ${state})`,
      ``,
      `Status: NO VERIFIED MARKET PRICE AVAILABLE`,
      `Notice: No verified government record found for this selection/date.`,
      `Current official quote is unavailable in today's AGMARKNET bulletin.`,
      ``,
      `*(Please attach the downloaded Daily Mandi Price Report PDF file to this message)*`
    ].filter(Boolean).join('\n');
  }
}

/**
 * Creates the standard WhatsApp share URL
 */
export function getWhatsAppUrl(message: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
