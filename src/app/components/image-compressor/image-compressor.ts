import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../file-upload/file-upload';
import { Result } from '../compression-result/compression-result';
import { CompressionResult, formatSize } from '../../models/compression-result.model';
import { ImageCompressionService } from '../../services/image-compression.service';
@Component({
  selector: 'app-image-compressor',
  imports: [FormsModule, FileUpload, Result],
  templateUrl: './image-compressor.html',
})
export class ImageCompressor implements OnDestroy {
  private service = inject(ImageCompressionService);
  file = signal<File | null>(null);
  preview = signal('');
  result = signal<CompressionResult | null>(null);
  error = signal('');
  busy = signal(false);
  quality = 80;
  width: number | null = null;
  height: number | null = null;
  ratio = 1;
  maintainRatio = true;
  format = 'image/webp';
  size = formatSize;
  private generation = 0;
  async select(file: File) {
    this.reset();
    const token = this.generation;
    this.busy.set(true);
    try {
      const bitmap = await createImageBitmap(file);
      if (token !== this.generation) {
        bitmap.close();
        return;
      }
      const w = bitmap.width,
        h = bitmap.height;
      bitmap.close();
      if (w * h > 32_000_000 || w > 8192 || h > 8192)
        throw new Error(
          'This image is too large to process safely. Use an image up to 8192 pixels per side and 32 megapixels.',
        );
      this.width = w;
      this.height = h;
      this.ratio = w / h;
      this.file.set(file);
      this.preview.set(URL.createObjectURL(file));
    } catch (e) {
      if (token === this.generation)
        this.error.set(
          e instanceof Error && e.message.includes('too large')
            ? e.message
            : 'Could not read this image. It may be damaged or unsupported.',
        );
    } finally {
      if (token === this.generation) this.busy.set(false);
    }
  }
  resize(axis: 'width' | 'height') {
    if (this.maintainRatio) {
      if (axis === 'width' && this.width)
        this.height = Math.max(1, Math.round(this.width / this.ratio));
      else if (this.height) this.width = Math.max(1, Math.round(this.height * this.ratio));
    }
    this.result.set(null);
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
      const result = await this.service.compress(file, {
        width: Number(this.width),
        height: Number(this.height),
        quality: this.quality,
        format: this.format,
      });
      if (token === this.generation) this.result.set(result);
    } catch (e) {
      if (token === this.generation)
        this.error.set(e instanceof Error ? e.message : 'Compression failed. Try a smaller image.');
    } finally {
      if (token === this.generation) this.busy.set(false);
    }
  }
  reset() {
    this.generation++;
    URL.revokeObjectURL(this.preview());
    this.preview.set('');
    this.file.set(null);
    this.result.set(null);
    this.error.set('');
    this.busy.set(false);
    this.width = null;
    this.height = null;
  }
  ngOnDestroy() {
    this.reset();
  }
}
