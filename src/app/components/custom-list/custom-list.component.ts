import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelephoneNumber } from '@interfaces/TelephoneNumber';
import { ForModule } from '@rx-angular/template/for';
import { TelItemComponent } from '@views/tel-checker/components/tel-item/tel-item.component';

@Component({
  selector: 'app-custom-list',
  standalone: true,
  imports: [CommonModule, ForModule, TelItemComponent],
  template: `
    <ng-container *rxFor="let item of data; trackBy: trackItem">
      <div
        class="d-flex align-items-center col-md-3 col-sm-6 border border-small py-2">
        <app-tel-item [item]="item"> </app-tel-item>
      </div>
    </ng-container>
    <ng-container *ngIf="data?.length === 0">
      <div data-cy="list-no-data">No data to display</div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomListComponent {
  /** Adds class to host */
  @HostBinding('class')
  class = `row m-0`;

  @Input() data?: TelephoneNumber[];
  trackItem(i: number, item: TelephoneNumber) {
    return item.id;
  }
}
