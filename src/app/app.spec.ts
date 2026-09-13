import { TestBed } from '@angular/core/testing';
import { App } from './app';
describe('Shrinkify', () => {
  it('starts with image compression disabled and switches to PDF', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Reduce File Size');
    expect(element.querySelector<HTMLButtonElement>('.compress-button')?.disabled).toBe(true);
    element.querySelector<HTMLButtonElement>('#pdf-tab')!.click();
    fixture.detectChanges();
    expect(element.querySelector('app-pdf-compressor')).toBeTruthy();
    expect(element.textContent).toContain('Embedded images are not recompressed');
  });
});
