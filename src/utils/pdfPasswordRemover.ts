// Simple PDF password operations using browser-based approach
// Note: These are simplified implementations for demonstration

export const removePdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check if PDF is encrypted by looking for encryption dictionary
    const pdfText = new TextDecoder('latin1').decode(uint8Array);
    
    if (!pdfText.includes('/Encrypt')) {
      throw new Error('PDF is not password protected');
    }
    
    // For demonstration: create a new PDF without encryption markers
    // In real implementation, you'd need proper PDF decryption
    let modifiedPdf = pdfText;
    
    // Remove encryption references (simplified approach)
    modifiedPdf = modifiedPdf.replace(/\/Encrypt\s+\d+\s+\d+\s+R/g, '');
    modifiedPdf = modifiedPdf.replace(/\/Filter\s*\/Standard/g, '');
    
    // Convert back to Uint8Array
    const encoder = new TextEncoder();
    const modifiedBytes = encoder.encode(modifiedPdf);
    
    return new Blob([modifiedBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error removing PDF password:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to remove PDF password');
  }
};

export const checkPdfPassword = async (pdfBlob: Blob): Promise<boolean> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to text to search for encryption markers
    const pdfText = new TextDecoder('latin1').decode(uint8Array);
    
    // Look for encryption indicators
    const hasEncrypt = pdfText.includes('/Encrypt');
    const hasFilter = pdfText.includes('/Filter') && pdfText.includes('/Standard');
    const hasUserPass = pdfText.includes('/U');
    const hasOwnerPass = pdfText.includes('/O');
    
    return hasEncrypt || (hasFilter && (hasUserPass || hasOwnerPass));
  } catch (error) {
    console.error('Error checking PDF password:', error);
    return false;
  }
};

export const addPdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  try {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to text for manipulation
    let pdfText = new TextDecoder('latin1').decode(uint8Array);
    
    // Check if already encrypted
    if (pdfText.includes('/Encrypt')) {
      throw new Error('PDF is already password protected');
    }
    
    // Find the document catalog
    const catalogMatch = pdfText.match(/(\d+)\s+\d+\s+obj\s*<<[^>]*\/Type\s*\/Catalog/);
    if (!catalogMatch) {
      throw new Error('Could not find PDF catalog');
    }
    
    // Create a simple encryption dictionary (simplified approach)
    const encryptObj = `
${getNextObjectNumber(pdfText)} 0 obj
<<
/Filter /Standard
/V 1
/R 2
/O <${'0'.repeat(64)}>
/U <${'0'.repeat(64)}>
/P -4
>>
endobj
`;
    
    // Add encryption reference to catalog
    const catalogObjNum = catalogMatch[1];
    const catalogRegex = new RegExp(`(${catalogObjNum}\\s+\\d+\\s+obj\\s*<<[^>]*)(>>)`);
    pdfText = pdfText.replace(catalogRegex, `$1/Encrypt ${getNextObjectNumber(pdfText)} 0 R$2`);
    
    // Insert encryption object before xref
    const xrefIndex = pdfText.lastIndexOf('xref');
    if (xrefIndex === -1) {
      throw new Error('Could not find xref table');
    }
    
    pdfText = pdfText.slice(0, xrefIndex) + encryptObj + '\n' + pdfText.slice(xrefIndex);
    
    // Convert back to Uint8Array
    const encoder = new TextEncoder();
    const modifiedBytes = encoder.encode(pdfText);
    
    return new Blob([modifiedBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error adding PDF password:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to add PDF password');
  }
};

function getNextObjectNumber(pdfText: string): number {
  const objMatches = pdfText.match(/(\d+)\s+\d+\s+obj/g);
  if (!objMatches) return 1;
  
  const objNumbers = objMatches.map(match => {
    const num = match.match(/(\d+)/);
    return num ? parseInt(num[1]) : 0;
  });
  
  return Math.max(...objNumbers) + 1;
}

// Alternative approach using worker for better password handling
export const removePasswordWithWorker = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create a simple worker for PDF processing
    const workerCode = `
      self.onmessage = function(e) {
        const { pdfData, password } = e.data;
        
        try {
          // Process PDF data
          const uint8Array = new Uint8Array(pdfData);
          let pdfText = new TextDecoder('latin1').decode(uint8Array);
          
          // Simple password validation (in real implementation, use proper decryption)
          if (password.length < 1) {
            throw new Error('Password required');
          }
          
          // Remove encryption markers
          pdfText = pdfText.replace(/\\/Encrypt\\s+\\d+\\s+\\d+\\s+R/g, '');
          pdfText = pdfText.replace(/\\/Filter\\s*\\/Standard/g, '');
          
          const encoder = new TextEncoder();
          const result = encoder.encode(pdfText);
          
          self.postMessage({ success: true, data: result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    worker.onmessage = (e) => {
      const { success, data, error } = e.data;
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      
      if (success) {
        resolve(new Blob([data], { type: 'application/pdf' }));
      } else {
        reject(new Error(error || 'Worker processing failed'));
      }
    };
    
    worker.onerror = (error) => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      reject(new Error('Worker error: ' + error.message));
    };
    
    pdfBlob.arrayBuffer().then(buffer => {
      worker.postMessage({ pdfData: buffer, password });
    });
  });
};