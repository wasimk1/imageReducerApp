import { Component, input, output, signal } from '@angular/core';
@Component({
  selector: 'app-file-upload',
  template: `<div
    class="drop-zone"
    [class.dragging]="dragging()"
    (dragover)="$event.preventDefault(); dragging.set(true)"
    (dragleave)="dragging.set(false)"
    (drop)="drop($event)"
  >
    <div class="upload-symbol" aria-hidden="true">↥</div>
    <h3>Drop your {{ kind() === 'image' ? 'image' : 'PDF' }} here</h3>
    <p>or choose a file from your device</p>
    <button class="primary choose" type="button" (click)="picker.click()">
      ＋ &nbsp; Choose File</button
    ><input
      #picker
      type="file"
      hidden
      [accept]="
        kind() === 'image'
          ? 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
          : 'application/pdf,.pdf'
      "
      (change)="picked($event)"
    /><small
      >{{ kind() === 'image' ? 'JPG, PNG or WebP' : 'PDF documents' }} <span>·</span> Up to 50
      MB</small
    >
  </div>`,
})
export class FileUpload {
  kind = input<'image' | 'pdf'>('image');
  selected = output<File>();
  invalid = output<string>();
  dragging = signal(false);
  picked(event: Event) {
    const input = event.target as HTMLInputElement;
    this.validate(input.files);
    input.value = '';
  }
  drop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    this.validate(event.dataTransfer?.files);
  }
  validate(files: FileList | null | undefined) {
    if (!files?.length) return;
    if (files.length !== 1) {
      this.invalid.emit('Please choose one file at a time.');
      return;
    }
    const file = files[0];
    const valid =
      this.kind() === 'image'
        ? /\.(jpe?g|png|webp)$/i.test(file.name) &&
          (!file.type || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
        : /\.pdf$/i.test(file.name) && (!file.type || file.type === 'application/pdf');
    if (!valid)
      this.invalid.emit(
        'Unsupported file type. Please choose a supported ' + this.kind() + ' file.',
      );
    else if (!file.size) this.invalid.emit('This file is empty.');
    else if (file.size > 50 * 1024 * 1024)
      this.invalid.emit('This file exceeds the 50 MB limit. Choose a smaller file.');
    else this.selected.emit(file);
  }
}
