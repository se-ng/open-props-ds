import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

const AUTOFOCUS_SELECTOR = '[autofocus]';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

@Component({
  selector: 'dialog[se]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div data-dialog-surface><ng-content /></div>',
  host: {
    '[attr.aria-describedby]': 'ariaDescribedBy() ?? null',
    '[attr.aria-label]': 'ariaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() ?? null',
    '[attr.aria-modal]': 'modal() ? "true" : null',
    '[attr.data-modal]': 'modal() ? "" : null',
    '[attr.size]': 'size() === "default" ? null : size()',
    '[attr.tabindex]': '-1',
    '(cancel)': 'handleCancel($event)',
    '(click)': 'handleBackdropClick($event)',
    '(close)': 'handleClose()',
    '(keydown.escape)': 'handleEscapeKey($event)',
  },
})
export class SeDialogComponent {
  readonly ariaDescribedBy = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledBy = input<string | undefined>(undefined);
  readonly closeOnBackdrop = input(false, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  readonly modal = input(true, { transform: booleanAttribute });
  readonly open = input(false, { transform: booleanAttribute });
  readonly size = input<'default' | 'narrow' | 'wide'>('default');

  readonly closed = output<string>();
  readonly openChange = output<boolean>();
  readonly opened = output<void>();

  private readonly host = inject(ElementRef).nativeElement as HTMLDialogElement;
  private readonly document = inject(DOCUMENT);
  private readonly isReady = signal(false);
  private lastFocusedElement: HTMLElement | null = null;
  private isDocumentScrollLocked = false;
  private previousBodyOverflow = '';
  private previousBodyPaddingInlineEnd = '';
  private previousRootOverflow = '';
  private previousRootScrollbarGutter = '';

  constructor() {
    afterNextRender(() => {
      this.isReady.set(true);
    });

    effect(() => {
      if (!this.isReady()) {
        return;
      }

      this.syncOpenState(this.open(), this.modal());
    });
  }

  close(returnValue = ''): void {
    const dialog = this.host;

    if (!dialog.open) {
      return;
    }

    dialog.close(returnValue);
  }

  handleBackdropClick(event: MouseEvent): void {
    const dialog = this.host;

    if (!this.modal() || !this.closeOnBackdrop() || event.target !== dialog) {
      return;
    }

    dialog.close('backdrop');
  }

  handleCancel(event: Event): void {
    if (this.closeOnEscape()) {
      return;
    }

    event.preventDefault();
  }

  handleClose(): void {
    const dialog = this.host;

    this.unlockDocumentScroll();
    this.openChange.emit(false);
    this.closed.emit(dialog.returnValue);
    this.restoreFocus();
  }

  handleEscapeKey(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key !== 'Escape' || !this.closeOnEscape() || !this.host.open) {
      return;
    }

    event.preventDefault();
    this.host.close('escape');
  }

  private lockDocumentScroll(): void {
    if (this.isDocumentScrollLocked) {
      return;
    }

    const root = this.document.documentElement;
    const body = this.document.body;
    const view = this.document.defaultView;

    this.previousRootOverflow = root.style.overflow;
    this.previousRootScrollbarGutter = root.style.getPropertyValue('scrollbar-gutter');
    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingInlineEnd = body.style.getPropertyValue('padding-inline-end');

    // Keep the scrollbar gutter stable and compensate layout width while scrolling is locked.
    root.style.setProperty('scrollbar-gutter', 'stable');

    if (view) {
      const scrollbarWidth = Math.max(0, view.innerWidth - root.clientWidth);

      if (scrollbarWidth > 0) {
        const computedPaddingInlineEnd = Number.parseFloat(
          view.getComputedStyle(body).paddingInlineEnd || '0'
        );
        const nextPaddingInlineEnd = computedPaddingInlineEnd + scrollbarWidth;

        body.style.setProperty('padding-inline-end', `${nextPaddingInlineEnd}px`);
      }
    }

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    this.isDocumentScrollLocked = true;
  }

  private captureFocus(): void {
    const activeElement = this.document.activeElement;

    this.lastFocusedElement = activeElement instanceof HTMLElement ? activeElement : null;
  }

  private focusInitialTarget(): void {
    queueMicrotask(() => {
      const dialog = this.host;
      const initialTarget =
        dialog.querySelector<HTMLElement>(AUTOFOCUS_SELECTOR) ??
        dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

      (initialTarget ?? dialog).focus();
    });
  }

  private restoreFocus(): void {
    const elementToRestore = this.lastFocusedElement;

    this.lastFocusedElement = null;

    if (!elementToRestore) {
      return;
    }

    queueMicrotask(() => {
      if (elementToRestore.isConnected) {
        elementToRestore.focus();
      }
    });
  }

  private syncOpenState(shouldOpen: boolean, modal: boolean): void {
    const dialog = this.host;

    if (shouldOpen) {
      if (dialog.open) {
        if (modal) {
          this.lockDocumentScroll();
        } else {
          this.unlockDocumentScroll();
        }

        return;
      }

      this.captureFocus();

      if (modal) {
        this.lockDocumentScroll();

        try {
          dialog.showModal();
        } catch (error) {
          this.unlockDocumentScroll();
          throw error;
        }
      } else {
        this.unlockDocumentScroll();
        dialog.show();
      }

      this.opened.emit();
      this.focusInitialTarget();

      return;
    }

    if (dialog.open) {
      dialog.close();
      return;
    }

    this.unlockDocumentScroll();
  }

  private unlockDocumentScroll(): void {
    if (!this.isDocumentScrollLocked) {
      return;
    }

    const root = this.document.documentElement;
    const body = this.document.body;

    root.style.overflow = this.previousRootOverflow;
    body.style.overflow = this.previousBodyOverflow;

    if (this.previousRootScrollbarGutter) {
      root.style.setProperty('scrollbar-gutter', this.previousRootScrollbarGutter);
    } else {
      root.style.removeProperty('scrollbar-gutter');
    }

    if (this.previousBodyPaddingInlineEnd) {
      body.style.setProperty('padding-inline-end', this.previousBodyPaddingInlineEnd);
    } else {
      body.style.removeProperty('padding-inline-end');
    }

    this.isDocumentScrollLocked = false;
  }
}