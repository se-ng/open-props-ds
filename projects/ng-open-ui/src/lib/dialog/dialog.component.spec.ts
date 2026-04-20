import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeDialogComponent } from './dialog.component';

describe('SeDialogComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const originalShow = HTMLDialogElement.prototype.show;
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;

  beforeAll(() => {
    HTMLDialogElement.prototype.show = function show(): void {
      this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.showModal = function showModal(): void {
      this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.close = function close(returnValue = ''): void {
      this.returnValue = returnValue;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  });

  afterAll(() => {
    HTMLDialogElement.prototype.show = originalShow;
    HTMLDialogElement.prototype.showModal = originalShowModal;
    HTMLDialogElement.prototype.close = originalClose;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('opens the native dialog when the open input becomes true', async () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dialogElement().hasAttribute('open')).toBe(true);
  });

  it('prefers autofocus target when dialog opens', async () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await Promise.resolve();

    expect((document.activeElement as HTMLElement | null)?.textContent?.trim()).toBe(
      'Delete'
    );
  });

  it('keeps the dialog open on backdrop click by default', async () => {
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    dialogElement().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.isOpen()).toBe(true);
  });

  it('emits the close result when backdrop dismissal is enabled', async () => {
    host.allowBackdropClose.set(true);
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    dialogElement().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.isOpen()).toBe(false);
    expect(host.lastResult()).toBe('backdrop');
  });

  it('prevents escape dismissal when closeOnEscape is false', async () => {
    host.allowEscapeClose.set(false);
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const cancelEvent = new Event('cancel', { cancelable: true });

    dialogElement().dispatchEvent(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(dialogElement().hasAttribute('open')).toBe(true);
  });

  it('closes with escape return value when escape handling is enabled', async () => {
    host.allowEscapeClose.set(true);
    host.isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    dialogElement().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.isOpen()).toBe(false);
    expect(host.lastResult()).toBe('escape');
  });

  function dialogElement(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog[se]') as HTMLDialogElement;
  }
});

@Component({
  imports: [SeDialogComponent],
  template: `
    <button type="button">Open</button>
    <dialog
      se
      [open]="isOpen()"
      [closeOnBackdrop]="allowBackdropClose()"
      [closeOnEscape]="allowEscapeClose()"
      ariaLabel="Dialog test"
      (closed)="lastResult.set($event)"
      (openChange)="isOpen.set($event)"
    >
      <div data-dialog-body>Body</div>
      <div data-dialog-actions>
        <button type="button">Cancel</button>
        <button type="button" autofocus>Delete</button>
      </div>
    </dialog>
  `,
})
class TestHostComponent {
  readonly allowBackdropClose = signal(false);
  readonly allowEscapeClose = signal(true);
  readonly isOpen = signal(false);
  readonly lastResult = signal('');
}