import { Injectable } from '@angular/core';
import { CompressionResult } from '../models/compression-result.model';
export type PdfLevel = 'Low' | 'Medium' | 'High';
@Injectable({ providedIn: 'root' })
export class PdfCompressionService {
  async load(file: File) {
    const { PDFDocument } = await import('pdf-lib');
    return PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  }
  async pages(file: File) {
    return (await this.load(file)).getPageCount();
  }
  async compress(file: File, level: PdfLevel): Promise<CompressionResult> {
    const doc = await this.load(file);
    if (level === 'High') {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setCreator('');
      doc.setProducer('');
    }
    const bytes = await doc.save({
      useObjectStreams: level !== 'Low',
      addDefaultPage: false,
      updateFieldAppearances: false,
      objectsPerTick: 30,
    });
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
    return {
      blob: blob.size < file.size ? blob : file,
      originalSize: file.size,
      fileName: file.name.replace(/\.pdf$/i, '') + '-shrinkify.pdf',
      note:
        blob.size >= file.size
          ? 'This PDF is already optimized. We kept your original file because rewriting it did not reduce its size.'
          : 'PDF optimized without rasterizing pages. Text and vector graphics remain intact.',
    };
  }
}
