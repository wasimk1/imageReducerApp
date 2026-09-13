export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  fileName: string;
  note?: string;
}
export function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
