import { Component, input, output, computed, effect, signal } from '@angular/core';
import { CompressionResult, formatSize } from '../../models/compression-result.model';
@Component({
  selector: 'app-compression-result',
  template: `<section class="result" aria-label="Compression result">
    <div class="result-heading">
      <span>✓</span>
      <div>
        <span class="eyebrow">ALL DONE</span>
        <h3>Your file, a little lighter.</h3>
      </div>
    </div>
    <div class="stats">
      <div>
        <small>Before</small><strong>{{ size(result().originalSize) }}</strong>
      </div>
      <div>
        <small>After</small><strong>{{ size(result().blob.size) }}</strong>
      </div>
      <div class="saved">
        <small>{{ saving() >= 0 ? 'Saved' : 'Larger by' }}</small
        ><strong>{{ abs(saving()) }}%</strong>
      </div>
    </div>
    @if (result().note) {
      <p class="hint">{{ result().note }}</p>
    }
    @if (originalUrl()) {
      <div class="comparison">
        <figure>
          <img [src]="originalUrl()" alt="Original image" />
          <figcaption>Original</figcaption>
        </figure>
        <figure>
          <img [src]="url()" alt="Compressed image" />
          <figcaption>Compressed</figcaption>
        </figure>
      </div>
    }
    <div class="result-actions">
      <a class="primary" [href]="url()" [download]="result().fileName">↓ &nbsp; Download file</a
      ><button class="secondary" (click)="again.emit()">Compress Another File</button>
    </div>
  </section>`,
})
export class Result {
  result = input.required<CompressionResult>();
  originalUrl = input('');
  again = output<void>();
  url = signal('');
  size = formatSize;
  abs = Math.abs;
  saving = computed(() =>
    Math.round((1 - this.result().blob.size / this.result().originalSize) * 100),
  );
  constructor() {
    effect((onCleanup) => {
      const url = URL.createObjectURL(this.result().blob);
      this.url.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }
}
