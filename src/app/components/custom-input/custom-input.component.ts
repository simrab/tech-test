import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
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
      <label *ngIf="label">{{ label }}</label>
      <input
        class="form-control"
        [id]="fieldName"
        [name]="fieldName"
        [type]="type"
        [placeholder]="placeholder || 'insert a value'"
        [value]="value || ''"
        (keyup.enter)="enter.emit()"
        (keyup)="changed($event)"
        (blur)="onTouched()" />
      <ng-content> </ng-content>
      <ng-container *ngIf="isSubmitted">
        <p class="text-danger fs-7 mt-2" data-cy="input-error">
          <ng-container *ngIf="field?.hasError('required')">
            Required
          </ng-container>
          <ng-container *ngIf="field?.hasError('minlength')"
            >a valid south african telephone number has 11 digits</ng-container
          >
        </p>
      </ng-container>
    </div>
  `,
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
  constructor(private cdr: ChangeDetectorRef) {}

  changed = (event: Event) => {
    if (this.onChange) {
      this.onChange((event.target as HTMLInputElement).value);
    }
  };
  value?: string;
  disabled = false;
  touched = false;
  @Input() label?: string;
  @Input() placeholder?: string;

  @Input() isSubmitted = false;

  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;

  @Input() type = 'text';

  @Output() enter = new EventEmitter<void>();

  onTouched = () => undefined;

  get field() {
    this.markAsTouched();
    return this.formGroup.get(this.fieldName);
  }

  onChange?: (value: string) => undefined;
  writeValue(value: string): void {
    this.value = value;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
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
