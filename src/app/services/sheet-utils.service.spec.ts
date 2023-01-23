import { TestBed } from '@angular/core/testing';
import { WorkBook } from 'xlsx';

import { SheetUtilsService } from './sheet-utils.service';
import restoreAllMocks = jest.restoreAllMocks;

describe('SheetUtilsService', () => {
  let service: SheetUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SheetUtilsService],
    });
    service = TestBed.inject(SheetUtilsService);
  });
  afterEach(() => {
    restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('readAndConvertWorkbookToJson should read and convert excel file to json ', () => {
    const spy = jest.spyOn(service, 'readAndConvertWorkbookToJson');
    service.readAndConvertWorkbookToJson({
      SheetNames: ['test'],
      Sheets: {},
    } as WorkBook);
    expect(spy).toHaveBeenCalled();
  });
  it('createDownloadableExcelFile should create downloadable excel file', () => {
    const spy = jest.spyOn(service, 'createDownloadableExcelFile');
    global.URL.createObjectURL = jest.fn();
    service.createDownloadableExcelFile({ data: [], fileName: 'test' });
    expect(spy).toHaveBeenCalled();
  });
});
