import { Component } from '@angular/core';
@Component({
  selector: 'app-hero',
  template: `<section class="hero">
    <span class="hero-pill"><span>✦</span> LESS SIZE. MORE FREEDOM.</span>
    <h1>Reduce File Size<br /><span>Without Losing Quality</span><i>.</i></h1>
    <p>
      Big files, meet your lighter side. Compress images and PDFs<br class="desktop-break" />
      securely in your browser. Simple, fast, and completely free.
    </p>
    <div class="hero-meta">
      <span>✓ No sign-up</span><span>✓ No uploads</span><span>✓ Just smaller files</span>
    </div>
    <span class="hero-decoration left" aria-hidden="true">▧<small>JPG</small></span
    ><span class="hero-decoration right" aria-hidden="true">▤<small>PDF</small></span>
  </section>`,
})
export class Hero {}
