import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tel-list-header',
  standalone: true,
  imports: [CommonModule],
  template: `<header class="mt-3 mb-3">
    <h1>Telephone list assignment</h1>
    <div class="row my-3">
      <div class="col-6">
        <ng-content select="[stringTester]"></ng-content>
      </div>
      <div class="col-6 text-end">
        <button
          type="button"
          data-cy="download-trigger"
          class="btn btn-outline-primary me-3"
          (click)="download.emit()">
          Download
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          data-cy="upload-trigger"
          (click)="triggerUpload()">
          Upload
        </button>
      </div>
    </div>
    <div class="form-group visually-hidden">
      <input
        #fileUpload
        data-cy="file-upload"
        type="file"
        id="file"
        name="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        (change)="upload.emit($event)"
        (click)="clearFile()" />
    </div>
  </header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelListHeaderComponent {
  @Output() upload = new EventEmitter<Event>();
  @Output() download = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload?: ElementRef;

  /** Trigger the upload file input */
  triggerUpload() {
    if (this.fileUpload) {
      const el = this.fileUpload.nativeElement;
      el.click();
    }
  }

  /** Clear the file input, so you can add two time the same file*/
  clearFile() {
    if (this.fileUpload) {
      const el = this.fileUpload.nativeElement;
      el.value = '';
    }
  }
}
