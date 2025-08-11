// Browser-compatible PDF encryption is limited with current libraries.
// pdf-lib doesn't support encryption, and node-qpdf2 requires file system access.
// 
// Options for implementing PDF encryption in browser:
// 1. Use a WASM-compiled version of qpdf/pdfcpu
// 2. Implement custom PDF encryption (complex, not recommended)
// 3. Use a server-side endpoint (breaks "no upload" promise)
//
// For now, this is a placeholder that will show a clear error message.

export const HAS_WASM = false; // Flip to true when a real WASM encryptor is wired

export async function encryptPdfInBrowser(inputPdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  // eslint-disable-next-line no-unused-vars
  const _ = { inputPdfBytes, password };
  
  throw new Error(
    'PDF encryption requires a WASM-based encryption engine. ' +
    'We are working on integrating qpdf/pdfcpu WASM builds. ' +
    'For now, you can use the "Remove Password" feature to unlock existing PDFs.'
  );
}


