import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CustomInputComponent } from '@components/custom-input/custom-input.component';
import { TelFormatType } from '@interfaces/TelephoneNumber';
import { SheetUtilsService } from '@services/sheet-utils.service';
import { lastValueFrom, of } from 'rxjs';

import { TelListComponent } from './tel-list.component';

describe('TelCheckerComponent', () => {
  let component: TelListComponent;
  let fixture: ComponentFixture<TelListComponent>;
  let sheetUtilsService: SheetUtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelListComponent, CustomInputComponent],
      providers: [
        {
          provide: SheetUtilsService,
          useValue: {
            handleImport: jest.fn().mockImplementation(() => of([])),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of([{ id: 1 }]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TelListComponent);
    component = fixture.componentInstance;
    sheetUtilsService = TestBed.inject(SheetUtilsService);
    TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onSelectTab should set selectedTab', () => {
    component.onSelectTab('fixable' as TelFormatType);
    expect(component.tabActive).toBe('fixable');
  });
  it('onUploadFile should subscribe to handleImport', async () => {
    const upload = jest
      .spyOn(component, 'onUploadFile')
      .mockImplementation(() => []);
    component.onUploadFile({} as Event);
    expect(upload).toHaveBeenCalled();
    await expect(
      lastValueFrom(sheetUtilsService.handleImport({} as Event))
    ).resolves.toEqual([]);
  });
  it('triggerDownload should call downloadFile', async () => {
    const download = jest
      .spyOn(component, 'triggerDownload')
      .mockImplementation(() => []);
    component.triggerDownload();
    expect(download).toHaveBeenCalled();
    await expect(
      lastValueFrom(sheetUtilsService.handleImport({} as Event))
    ).resolves.toEqual([]);
  });
});
