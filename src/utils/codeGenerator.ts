import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export interface CodeGeneratorData {
  name?: string;
  number?: string;
  link?: string;
  address?: string;
  pin?: string;
}

export type OutputFormat = 'png' | 'jpg';

// Generate QR Code
export const generateQRCode = async (
  data: CodeGeneratorData,
  format: OutputFormat = 'png'
): Promise<Blob> => {
  try {
    // Create data string from input fields
    const dataString = createDataString(data);
    
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, dataString, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate QR code'));
          }
        },
        format === 'png' ? 'image/png' : 'image/jpeg',
        0.9
      );
    });
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate Barcode
export const generateBarcode = async (
  data: CodeGeneratorData,
  format: OutputFormat = 'png'
): Promise<Blob> => {
  try {
    // For barcode, we'll use the number field or create a string from all data
    let barcodeText = data.number || createDataString(data);
    
    // Remove non-alphanumeric characters for barcode compatibility
    barcodeText = barcodeText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (!barcodeText) {
      throw new Error('No valid data provided for barcode generation');
    }

    const canvas = document.createElement('canvas');
    
    try {
      JsBarcode(canvas, barcodeText, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10
      });
    } catch (barcodeError) {
      // Fallback to a simpler format if CODE128 fails
      JsBarcode(canvas, barcodeText, {
        format: "CODE39",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10
      });
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate barcode'));
          }
        },
        format === 'png' ? 'image/png' : 'image/jpeg',
        0.9
      );
    });
  } catch (error) {
    console.error('Barcode generation error:', error);
    throw new Error('Failed to generate barcode: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Helper function to create data string from form data
function createDataString(data: CodeGeneratorData): string {
  const parts = [];
  
  if (data.name) parts.push(`Name: ${data.name}`);
  if (data.number) parts.push(`Number: ${data.number}`);
  if (data.link) parts.push(`Link: ${data.link}`);
  if (data.address) parts.push(`Address: ${data.address}`);
  if (data.pin) parts.push(`PIN: ${data.pin}`);
  
  return parts.join('\n') || 'No data provided';
}

// Download generated code
export const downloadCode = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};