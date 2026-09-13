import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { ImageCompressor } from './components/image-compressor/image-compressor';
import { PdfCompressor } from './components/pdf-compressor/pdf-compressor';
import { Footer } from './components/footer/footer';
@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, ImageCompressor, PdfCompressor, Footer],
  templateUrl: './app.html',
})
export class App {
  readonly mode = signal<'image' | 'pdf'>('image');
}
