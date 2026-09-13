import { Injectable } from '@angular/core';
import { CompressionResult } from '../models/compression-result.model';
export interface ImageSettings {
  quality: number;
  width: number;
  height: number;
  format: string;
}
@Injectable({ providedIn: 'root' })
export class ImageCompressionService {
  async compress(file: File, settings: ImageSettings): Promise<CompressionResult> {
    const { width, height, format, quality } = settings;
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > 8192 ||
      height > 8192 ||
      width * height > 32_000_000
    )
      throw new Error(
        'Use dimensions between 1 and 8192 pixels, with no more than 32 million pixels.',
      );
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Your browser does not support image processing.');
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, width, height);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (value) => (value ? resolve(value) : reject(new Error('Could not encode this image.'))),
          format,
          quality / 100,
        ),
      );
      if (blob.type !== format)
        throw new Error('Your browser cannot export this format. Please choose PNG or JPG.');
      const sameFormat =
        file.type === format ||
        (!file.type &&
          (format === 'image/jpeg'
            ? /\.jpe?g$/i
            : format === 'image/png'
              ? /\.png$/i
              : /\.webp$/i
          ).test(file.name));
      if (
        sameFormat &&
        width === bitmap.width &&
        height === bitmap.height &&
        blob.size >= file.size
      )
        return {
          blob: file,
          originalSize: file.size,
          fileName: file.name,
          note: 'Already efficient! The original is smaller, so we kept it without extra quality loss.',
        };
      return {
        blob,
        originalSize: file.size,
        fileName:
          file.name.replace(/\.[^.]+$/, '') +
          '-shrinkify.' +
          (format === 'image/jpeg' ? 'jpg' : format.split('/')[1]),
        note:
          blob.size >= file.size
            ? 'Your selected format or dimensions produced a larger file. Try WebP or smaller dimensions.'
            : undefined,
      };
    } finally {
      bitmap.close();
    }
  }
}
