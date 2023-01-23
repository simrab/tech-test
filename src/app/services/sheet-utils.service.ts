import { Injectable } from '@angular/core';
import {
  TelephoneNumber,
  TelephoneNumberFormatted,
} from '@interfaces/TelephoneNumber';
import { Observable } from 'rxjs';
import { read, utils, WorkBook, WorkSheet, write } from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Injectable({
  providedIn: 'any',
})
export class SheetUtilsService {
  private acceptFileExt = ['.xls', '.xlsx', '.csv'];
  private acceptedExtensionsReg?: RegExp;

  private errors = {
    headersWrong: 'File should have id and sms_phone headers',
    noFile: 'Upload file missing',
  };

  /**
   * Converts .csv, .xslx, .xls file to json and returns it as observable
   * Returns error if file invalid
   * @param evt input file event
   */
  handleImport(evt: Event) {
    let errors: keyof typeof this.errors | null = null;
    let json: TelephoneNumberFormatted[] = [];
    const files = (evt.target as HTMLInputElement).files as FileList | null;
    this.acceptedExtensionsReg = new RegExp(
      this.acceptFileExt.join('|').replace(/\./g, '\\.')
    );

    if (files && files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        /* read workbook */
        const bstr = event.target?.result;
        const workBook: WorkBook = read(bstr, { type: 'binary' });

        /* convert file data to json */
        const jsonConverted =
          this.readAndConvertWorkbookToJson<TelephoneNumberFormatted>(workBook);
        /** If file does not have id and sms_phone headers show error */
        if (
          !jsonConverted.headers ||
          !jsonConverted.headers.includes('sms_phone') ||
          !jsonConverted.headers.includes('id')
        ) {
          errors = 'headersWrong';
        }
        json = [...jsonConverted.data];
      };
      reader.readAsArrayBuffer(file);
      return new Observable(observer => {
        reader.onloadend = () => {
          if (errors) {
            observer.error(this.errors[errors]);
          } else {
            observer.next(json);
          }
          observer.complete();
        };
      });
    } else {
      return new Observable(observer => {
        observer.error(this.errors['noFile']);
      });
    }
  }

  /**
   * Reads and converts workbook to json
   * @param workBook  workbook to convert
   */
  readAndConvertWorkbookToJson<T>(workBook: WorkBook): {
    data: T[];
    headers: string[];
  } {
    /* grab first sheet */
    const workSheetName: string = workBook.SheetNames[0];
    const workSheet: WorkSheet = workBook.Sheets[workSheetName];
    /* save data in json format */
    return {
      data: utils.sheet_to_json(workSheet),
      headers: utils.sheet_to_json(workSheet, {
        header: 1,
      })[0] as string[],
    };
  }

  /**
   * Converts json to xlsx file and downloads it
   * @param data  json data to convert
   * @param fileName  name of the file
   */
  createDownloadableExcelFile({
    data,
    fileName,
  }: {
    data: TelephoneNumber[];
    fileName: string;
  }) {
    const worksheet = utils.json_to_sheet(data);

    const workbook: WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer = write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  /**
   * Saves file as xlsx
   * @param buffer file buffer
   * @param fileName name of the file
   */
  private saveAsExcelFile(buffer: BlobPart, fileName: string) {
    const file: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(file);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
