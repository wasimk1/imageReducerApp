import { PDFDocument } from 'pdf-lib';
import { PdfCompressionService } from './pdf-compression.service';
describe('PDF optimization', () => {
  const service = new PdfCompressionService();
  it('retains readable pages and never returns a larger PDF', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.addPage();
    doc.setTitle('Example');
    const bytes = await doc.save({ useObjectStreams: false });
    const file = new File([new Uint8Array(bytes)], 'example.pdf', { type: 'application/pdf' });
    for (const level of ['Low', 'Medium', 'High'] as const) {
      const result = await service.compress(file, level);
      expect(result.blob.size).toBeLessThanOrEqual(file.size);
      const decoded = await PDFDocument.load(await result.blob.arrayBuffer());
      expect(decoded.getPageCount()).toBe(2);
      if (level === 'Medium') expect(decoded.getTitle()).toBe('Example');
    }
  });
  it('rejects damaged PDFs', async () => {
    await expect(service.pages(new File(['invalid'], 'broken.pdf'))).rejects.toThrow();
  });
});
