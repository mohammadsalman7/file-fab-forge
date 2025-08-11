import * as zip from '@zip.js/zip.js';

export type ZipEntry = {
  name: string;
  blob: Blob;
};

export async function createPasswordProtectedZip(entries: ZipEntry[], password: string): Promise<Blob> {
  if (!password?.trim()) throw new Error('Password is required');

  // Optional: disable web workers for broader compatibility
  // zip.configure({ useWebWorkers: false });

  const blobWriter = new zip.BlobWriter('application/zip');
  const zipWriter = new zip.ZipWriter(blobWriter);

  for (const entry of entries) {
    const safeName = entry.name && /\S/.test(entry.name) ? entry.name : 'document.pdf';
    await zipWriter.add(safeName, new zip.BlobReader(entry.blob), {
      password,
      // Use ZipCrypto for maximum Windows Explorer compatibility (will prompt reliably).
      // Note: ZipCrypto is weaker than AES. If you prefer AES, set 2 or 3, but
      // Windows built-in extractor may fail with 0x80004005.
      encryptionStrength: 1,
      level: 6,
    } as any);
  }

  await zipWriter.close();
  return await blobWriter.getData();
}


