import { TestBed } from '@angular/core/testing';
import { FileUpload } from './file-upload';
describe('Upload validation', () => {
  it('rejects unsupported, empty and oversized files', () => {
    const component = TestBed.runInInjectionContext(() => new FileUpload());
    const errors: string[] = [];
    component.invalid.subscribe((message) => errors.push(message));
    for (const file of [
      new File(['x'], 'script.svg', { type: 'image/svg+xml' }),
      new File([], 'empty.png', { type: 'image/png' }),
      new File([new Uint8Array(50 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' }),
    ])
      component.validate({ 0: file, length: 1 } as unknown as FileList);
    expect(errors.length).toBe(3);
  });
  it('accepts a supported image', () => {
    const component = TestBed.runInInjectionContext(() => new FileUpload());
    const chosen: File[] = [];
    component.selected.subscribe((file) => chosen.push(file));
    const file = new File(['image'], 'photo.webp', { type: 'image/webp' });
    component.validate({ 0: file, length: 1 } as unknown as FileList);
    expect(chosen).toEqual([file]);
  });
});
