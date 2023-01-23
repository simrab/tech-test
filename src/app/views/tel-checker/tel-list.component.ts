import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SheetUtilsService } from '@services/sheet-utils.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TelListHeaderComponent } from '@views/tel-checker/components/tel-list-header/tel-list-header.component';
import { CustomInputComponent } from '@components/custom-input/custom-input.component';
import { CustomListComponent } from '@components/custom-list/custom-list.component';
import { read } from 'xlsx';
import { TelephoneNumber, TelFormatType } from '@interfaces/TelephoneNumber';
import { TelformatterService } from '@services/telformatter.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/for';
import { TelephoneNumberGroup } from '@interfaces/TelephoneNumber';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LetModule,
    ForModule,
    CustomListComponent,
    TelListHeaderComponent,
    CustomInputComponent,
    RouterModule,
    ReactiveFormsModule,
  ],
  template: `
    <app-tel-list-header
      (upload)="onUploadFile($event)"
      (download)="triggerDownload()">
      <form [formGroup]="telTester" stringTester>
        <app-custom-input
          *rxLet="isSubmitted$; let isSubmitted"
          [isSubmitted]="isSubmitted"
          formControlName="tel"
          data-cy="tel-input"
          type="number"
          fieldName="tel"
          [formGroup]="telTester"
          placeholder="insert a tel to validate">
        </app-custom-input>
      </form>
    </app-tel-list-header>
    <ng-container
      *rxLet="formattedTelNumbers$; let formattedTelNumbers; let s = suspense">
      <ul class="nav nav-tabs">
        <ng-container *rxFor="let type of telTypes$">
          <li class="nav-item">
            <a
              class="nav-link"
              [id]="type"
              aria-current="page"
              [href]="'#' + type"
              [ngClass]="tabActive === type ? 'active' : ''"
              (click)="onSelectTab(type)"
              >{{ typesLabels[type] | uppercase }}</a
            >
          </li>
        </ng-container>
      </ul>
      <ng-container *rxFor="let type of telTypes$">
        <ng-container *ngIf="tabActive === type && formattedTelNumbers">
          <app-custom-list [data]="formattedTelNumbers[type]">
          </app-custom-list>
        </ng-container>
      </ng-container>
      <ng-template #suspense>loading...</ng-template>
    </ng-container>
  `,
  providers: [SheetUtilsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('fileUploader') fileUpload?: ElementRef<HTMLInputElement>;
  isSubmitted$ = new BehaviorSubject<boolean>(false);
  public formattedTelNumbers$ =
    new BehaviorSubject<TelephoneNumberGroup | null>(null);
  public telTypes$ = this.formatterService.teltypes$;
  public typesLabels = this.formatterService.tabTypesLabels;
  public tabActive: TelFormatType = 'valid';

  public telTester = new FormGroup({
    tel: new FormControl(null, [Validators.minLength(11)]),
  });
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,

    private sheetService: SheetUtilsService,
    private formatterService: TelformatterService
  ) {
    /** Set active tab based on url anchor */
    this.route.fragment
      .pipe(
        tap(fragment => {
          if (fragment) {
            this.tabActive = fragment as TelFormatType;
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnInit() {
    this.initData();
    this.telTester
      .get('tel')
      ?.valueChanges.pipe(
        debounceTime(600),
        distinctUntilChanged(),
        tap((tel: string | null) => {
          if (tel) {
            this.isSubmitted$.next(true);
            if (tel.length >= 11) {
              if (this.formatterService.isTelCorrect(+tel)) {
                alert(this.formatterService.validationLabels.valid);
              } else {
                const { fixable } = this.formatterService.fixTel(+tel);
                fixable
                  ? alert(
                      `${this.formatterService.validationLabels.fixable} ${fixable}`
                    )
                  : alert(this.formatterService.validationLabels.not_fixable);
              }
            }
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initData() {
    this.httpClient
      .get('assets/CsvForTest/base.csv', { responseType: 'text' })
      .pipe(
        tap(res => {
          const workBook = read(res, { type: 'binary' });
          /* save data */
          const json = [
            ...this.sheetService.readAndConvertWorkbookToJson<TelephoneNumber>(
              workBook
            ).data,
          ];
          this.formattedTelNumbers$.next(
            this.formatterService.formatTels(json)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
  /** Sets active tab */
  onSelectTab(activeTab: TelFormatType) {
    this.tabActive = activeTab;
  }

  /**
   * Uploads file, converts it to json, and saves it to formattedTelNumbers$.
   * Displays alert error if file is not valid.
   * @param event event from file input
   */
  onUploadFile(event: Event) {
    this.sheetService
      .handleImport(event)
      .pipe(
        catchError(err => {
          alert(err);
          throw err;
        }),
        tap(data => {
          this.formattedTelNumbers$.next(
            this.formatterService.formatTels(data as TelephoneNumber[])
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Downloads formattedTelNumbers$ as xlsx file.
   */
  triggerDownload() {
    const data = this.formattedTelNumbers$.value;
    if (data) {
      this.sheetService.createDownloadableExcelFile({
        data: this.formatterService.createExcelFileData(data),
        fileName: 'valid_tel_numbers',
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
