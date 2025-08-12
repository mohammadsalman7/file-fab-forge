// Utilities for protecting PDFs (adding an open password) in the browser
// This delegates actual encryption to a pluggable browser encryptor
// implemented in `pdfEncryptWasm.ts`. Until a WASM engine is integrated,
// it will throw a clear, actionable error.

export const addPdfPassword = async (pdfBlob: Blob, password: string): Promise<Blob> => {
  if (!password?.trim()) {
    throw new Error('Password is required');
  }

  const pdfBytes = new Uint8Array(await pdfBlob.arrayBuffer());

  try {
    const { encryptPdfInBrowser, HAS_WASM } = await import('./pdfEncryptWasm.ts');
    if (!HAS_WASM) {
      throw new Error('unavailable');
    }
    const encryptedBytes = await encryptPdfInBrowser(pdfBytes, password);
    return new Blob([new Uint8Array(encryptedBytes)], { type: 'application/pdf' });
  } catch (err) {
    // Keep logs for debugging, show friendly message to user
    console.error('PDF encryption not available:', err);
    throw new Error('Protect PDF is not available in this browser-only build yet.');
  }
};

export const isProtectAvailable = async (): Promise<boolean> => {
  try {
    const mod = await import('./pdfEncryptWasm.ts');
    return Boolean((mod as any).HAS_WASM);
  } catch {
    return false;
  }
};


