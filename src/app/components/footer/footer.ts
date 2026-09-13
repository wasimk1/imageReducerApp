import { Component } from '@angular/core';
@Component({
  selector: 'app-footer',
  template: `<footer>
      <div>
        <a class="brand" href="#home"><span class="brand-icon">↘</span>Shrinkify.</a>
        <p>Compress images and PDFs securely in your browser.</p>
      </div>
      <div class="footer-right">
        <div>
          <a href="#privacy">Privacy</a><a href="#about">About</a
          ><a
            href="https://github.com/topics/image-compression"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub ↗</a
          >
        </div>
        <small>Made a little lighter. Built with Angular.</small>
      </div>
    </footer>
    <details id="privacy" class="privacy-details">
      <summary>Our privacy promise</summary>
      <p>
        Files are processed in memory on your device. Shrinkify has no upload API, analytics,
        database, or cloud storage. Refreshing or removing a file clears it from the app. Downloaded
        files stay wherever you save them.
      </p>
    </details>`,
})
export class Footer {}
