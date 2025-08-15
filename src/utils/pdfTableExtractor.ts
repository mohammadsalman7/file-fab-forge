import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
// Tell pdf.js to use the locally bundled worker file (no CDN)
// @ts-ignore - handled by Vite
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl as unknown as string;

interface TableCell {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TableRow {
  cells: TableCell[];
  y: number;
}

interface Table {
  rows: TableRow[];
  columns: number;
}

/**
 * Detect and extract tables from PDF text content
 * @param textItems - Array of text items with position information
 * @returns Table[] - Array of detected tables
 */
export const detectTables = (textItems: any[]): Table[] => {
  const tables: Table[] = [];
  
  // Group text items by Y position to identify rows
  const yGroups = new Map<number, any[]>();
  
  textItems.forEach(item => {
    const y = Math.round(item.transform[5]);
    if (!yGroups.has(y)) {
      yGroups.set(y, []);
    }
    yGroups.get(y)!.push(item);
  });
  
  // Sort Y positions (top to bottom)
  const sortedYs = Array.from(yGroups.keys()).sort((a, b) => b - a);
  
  // Detect table structure
  let currentTable: TableRow[] = [];
  let lastY = -1;
  const rowSpacing = 20; // Threshold for row spacing
  
  sortedYs.forEach(y => {
    const items = yGroups.get(y)!;
    
    // Sort items by X position (left to right)
    const sortedItems = items.sort((a, b) => a.transform[4] - b.transform[4]);
    
    // Check if this looks like a table row
    const isTableRow = sortedItems.length > 1 && 
                      sortedItems.some(item => item.str.trim().length > 0);
    
    if (isTableRow) {
      if (lastY === -1 || Math.abs(y - lastY) <= rowSpacing) {
        // Same table
        const row: TableRow = {
          cells: sortedItems.map(item => ({
            text: item.str,
            x: item.transform[4],
            y: item.transform[5],
            width: item.width,
            height: item.height
          })),
          y: y
        };
        currentTable.push(row);
      } else {
        // New table
        if (currentTable.length > 0) {
          tables.push({
            rows: currentTable,
            columns: Math.max(...currentTable.map(row => row.cells.length))
          });
        }
        currentTable = [{
          cells: sortedItems.map(item => ({
            text: item.str,
            x: item.transform[4],
            y: item.transform[5],
            width: item.width,
            height: item.height
          })),
          y: y
        }];
      }
      lastY = y;
    }
  });
  
  // Add the last table
  if (currentTable.length > 0) {
    tables.push({
      rows: currentTable,
      columns: Math.max(...currentTable.map(row => row.cells.length))
    });
  }
  
  return tables;
};

/**
 * Convert table to CSV format
 * @param table - The table to convert
 * @returns string - CSV formatted table
 */
export const tableToCsv = (table: Table): string => {
  const csvRows: string[] = [];
  
  table.rows.forEach(row => {
    const csvCells = row.cells.map(cell => {
      // Escape quotes and wrap in quotes
      const escapedText = cell.text.replace(/"/g, '""');
      return `"${escapedText}"`;
    });
    csvRows.push(csvCells.join(','));
  });
  
  return csvRows.join('\n');
};

/**
 * Convert table to formatted text
 * @param table - The table to convert
 * @returns string - Formatted table text
 */
export const tableToFormattedText = (table: Table): string => {
  const lines: string[] = [];
  
  table.rows.forEach(row => {
    const formattedCells = row.cells.map(cell => cell.text.padEnd(20));
    lines.push(formattedCells.join(' | '));
  });
  
  return lines.join('\n');
};

/**
 * Extract tables from PDF and convert to various formats
 * @param pdfBlob - The PDF file as a Blob
 * @returns Promise<{tables: Table[], csvContent: string, formattedContent: string}>
 */
export const extractTablesFromPdf = async (pdfBlob: Blob): Promise<{
  tables: Table[];
  csvContent: string;
  formattedContent: string;
}> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise as PDFDocumentProxy;
    
    const allTables: Table[] = [];
    const numPages = pdf.numPages;
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Detect tables on this page
      const pageTables = detectTables(textContent.items);
      allTables.push(...pageTables);
    }
    
    // Convert tables to CSV
    const csvContent = allTables.map(table => tableToCsv(table)).join('\n\n');
    
    // Convert tables to formatted text
    const formattedContent = allTables.map(table => tableToFormattedText(table)).join('\n\n');
    
    return {
      tables: allTables,
      csvContent,
      formattedContent
    };
  } catch (error) {
    console.error('Error extracting tables from PDF:', error);
    throw new Error('Failed to extract tables from PDF.');
  }
};
