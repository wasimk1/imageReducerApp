import { Component, output } from '@angular/core';
@Component({
  selector: 'app-navbar',
  template: `<header>
    <nav class="nav" aria-label="Main navigation">
      <a class="brand" href="#home"
        ><span class="brand-icon">↘</span>Shrinkify<span class="brand-dot">.</span></a
      >
      <div class="nav-links">
        <a href="#home">Home</a
        ><a href="#compressor" (click)="modeChange.emit('image')">Image Compressor</a
        ><a href="#compressor" (click)="modeChange.emit('pdf')">PDF Compressor</a
        ><a href="#about">About</a>
      </div>
      <span class="nav-tag">100% free. Always.</span>
    </nav>
  </header>`,
})
export class Navbar {
  modeChange = output<'image' | 'pdf'>();
}
