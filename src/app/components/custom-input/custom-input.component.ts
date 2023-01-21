import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-relative">
      <input
        class="form-control"
        [id]="fieldName"
        [name]="fieldName"
        [type]="type"
        [value]="value || ''"
        (change)="changed($event)"
        (blur)="onTouched()" />
      <ng-content> </ng-content>
      <ng-container *ngIf="isSubmitted">
        <p *ngIf="field?.hasError('required')">Required</p>
        <p *ngIf="field?.hasError('email')">email format is incorrect</p>
        <p *ngIf="field?.hasError('minlength')">
          value is less than min valid length
        </p>
      </ng-container>
    </div>
  `,
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements ControlValueAccessor {
  changed = (event: Event) => {
    if (this.onChange) {
      this.onChange((event.target as HTMLInputElement).value);
    }
  };
  value?: string;
  disabled = false;

  @Input() isSubmitted = false;

  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;

  @Input() type = 'text';

  onTouched = () => undefined;

  get field() {
    return this.formGroup.get(this.fieldName);
  }
  onChange?: (value: string) => undefined;
  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: () => undefined): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => undefined): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
