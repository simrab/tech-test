import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelephoneNumberFormatted } from '@interfaces/TelephoneNumber';

@Component({
  selector: 'app-tel-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="item && item.fixable">
      <div class="mb-3" data-cy="fixable">
        <h6>Value fixed</h6>
        <div>{{ item.fixable }}</div>
      </div>
      <h6>Original Value</h6>
    </ng-container>
    <ng-container>
      <div class="text-break">{{ item?.sms_phone }}</div>
      <p class="mb-0 fs-7" data-cy="position">
        Position {{ 'Row ' + item?.row }}
      </p>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelItemComponent {
  @Input() item?: TelephoneNumberFormatted;
}
