import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'super[badge]',
  standalone: true,
  template: '{{ displayText() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.intent]': 'intent()',
    '[attr.position]': 'position()',
    '[attr.state]': 'state()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class BadgeComponent {
  // Inputs
  count = input<number | undefined>();
  intent = input<'notice' | 'warning' | 'danger' | 'success'>('notice');
  position = input<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>(
    'top-right'
  );
  state = input<'pulse' | undefined>();
  ariaLabelText = input<string | undefined>();

  // Computed display text
  displayText = computed(() => {
    const countValue = this.count();
    if (countValue === undefined) return '';
    if (countValue > 99) return '99+';
    return countValue.toString();
  });

  // Computed aria-label for accessibility
  ariaLabel = computed(() => {
    const label = this.ariaLabelText();
    if (label) return label;

    const countValue = this.count();
    if (countValue === undefined) return null;
    if (countValue === 1) return '1 item';
    return `${countValue} items`;
  });
}
