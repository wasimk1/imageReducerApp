import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../file-upload/file-upload';
import { Result } from '../compression-result/compression-result';
import { CompressionResult, formatSize } from '../../models/compression-result.model';
import { PdfCompressionService, PdfLevel } from '../../services/pdf-compression.service';
@Component({
  selector: 'app-pdf-compressor',
  imports: [FormsModule, FileUpload, Result],
  templateUrl: './pdf-compressor.html',
})
export class PdfCompressor implements OnDestroy {
  private service = inject(PdfCompressionService);
  private generation = 0;
  file = signal<File | null>(null);
  pages = signal(0);
  busy = signal(false);
  error = signal('');
  result = signal<CompressionResult | null>(null);
  level: PdfLevel = 'Medium';
  levels: PdfLevel[] = ['Low', 'Medium', 'High'];
  size = formatSize;
  async select(file: File) {
    this.reset();
    const token = this.generation;
    this.busy.set(true);
    try {
      const pages = await this.service.pages(file);
      if (token === this.generation) {
        this.pages.set(pages);
        this.file.set(file);
      }
    } catch {
      if (token === this.generation)
        this.error.set(
          'Could not read this PDF. Encrypted, password-protected, or damaged PDFs are not supported.',
        );
    } finally {
      if (token === this.generation) this.busy.set(false);
    }
  }
  async compress() {
    const file = this.file();
    if (!file || this.busy()) return;
    const token = this.generation;
    this.busy.set(true);
    this.error.set('');
    this.result.set(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 30));
      const result = await this.service.compress(file, this.level);
      if (token === this.generation) this.result.set(result);
    } catch {
      if (token === this.generation)
        this.error.set('Could not optimize this PDF. Please try a different document.');
    } finally {
      if (token === this.generation) this.busy.set(false);
    }
  }
  reset() {
    this.generation++;
    this.file.set(null);
    this.pages.set(0);
    this.result.set(null);
    this.error.set('');
    this.busy.set(false);
  }
  ngOnDestroy() {
    this.reset();
  }
}
