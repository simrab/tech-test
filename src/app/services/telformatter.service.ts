import { Injectable } from '@angular/core';
import {
  TelephoneNumber,
  TelephoneNumberFormatted,
  TelephoneNumberGroup,
  TelFormatType,
} from '@interfaces/TelephoneNumber';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
/** Correct format for a south african mobile phone number is  (+27 AA XXX XXXX). Es:27 83 123 4567
 * ("https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers#South_Africa") */
export class TelformatterService {
  /** Types of telephone numbers
   *  valid: Doesnt need to be fixed
   *  fixable: Invalid but can be fixed
   *  is not fixabe
   *  */
  public teltypes$: Observable<TelFormatType[]> = of([
    'valid',
    'fixable',
    'not_fixable',
  ]);

  public validationLabels = {
    valid: 'Valid phone number',
    fixable: 'Phone number fixable to:',
    not_fixable: 'Phone number not fixable',
  };
  public tabTypesLabels: Record<TelFormatType, string> = {
    fixable: 'Fixed telephone numbers',
    not_fixable: 'Invalid telephone numbers',
    valid: 'valid telephone numbers',
  };

  /**
   * Check if the tel number is correct
   * @param tel tel number
   * @returns true if the tel number is correct, false if is fixable or not fixable
   */
  isTelCorrect(tel: number | string): boolean {
    if (typeof tel === 'string') {
      tel = +tel;
    }
    /** Tel must be a valid number */
    /** Tel must have 11 digits */
    if (Number.isNaN(tel) || tel.toString().length !== 11) {
      return false;
    }
    /** Tel must start with 27 */
    return tel.toString().substring(0, 2) === '27';
  }

  /**
   * Fixes telephone number if possible
   * @param tel tel number
   * @returns object with the fixed object property with the tel number if fixed was possible, or null
   * fixed null and not_fixable with the tel number if fixed was not possible
   */
  fixTel(tel: number): {
    fixable: null | string;
    not_fixable: null | string;
  } {
    const str = tel.toString();
    let fixable = null;
    /** Check if the tel number has 2 and 7 */
    if (str.indexOf('2') > -1 && str.indexOf('7') > -1) {
      const strWithout27 = str.replace('2', '').replace('7', '');
      /** Check if value without 27 has at least 9 digits */
      if (strWithout27.length >= 9) {
        fixable = `27${strWithout27.substring(0, 9)}`;
      }
    }
    return {
      fixable,
      not_fixable: fixable !== null ? null : str,
    };
  }

  /**
   * Format telephone numbers
   * @param tels array of telephone numbers
   * @returns object where each key is a tel number type (sms_phone, fixable, not_fixable)
   */
  formatTels(tels: TelephoneNumber[]) {
    const telGroup: TelephoneNumberGroup = {
      fixable: [],
      not_fixable: [],
      valid: [],
    };

    tels.forEach((tel, i) => {
      let fixable = null;
      /** Check if the tel number, without letters or symbols, are bigger or equal than 11  */
      const strWithoutLetters = this.removeLettersInString(
        tel.sms_phone.toString().trim()
      );
      if (strWithoutLetters.length >= 11) {
        fixable = this.fixTel(+strWithoutLetters).fixable;
      }
      this.groupByTelType({
        emptyTelGroup: telGroup,
        valid: this.isTelCorrect(tel.sms_phone),
        fixable,
        tel,
        row: i,
      });
    });
    return telGroup;
  }

  /**
   * Format valid telephone numbers inside telephone group in a single array
   * @param telGroup object where each key is a tel number type (sms_phone, fixable, not_fixable)
   * @returns array of valid telephone numbers
   */
  createExcelFileData(
    telGroup: TelephoneNumberGroup
  ): TelephoneNumberFormatted[] {
    const fixableFormatted = telGroup.fixable.map(tel => {
      return {
        id: tel.id,
        sms_phone: +(tel.fixable as string),
      };
    });
    return [
      ...telGroup.valid.map(tel => ({
        id: tel.id,
        sms_phone: tel.sms_phone,
      })),
      ...fixableFormatted,
    ];
  }

  /**
   * Push telephone number into an object where each key
   *  is a tel number type (sms_phone, fixable, not_fixable) and the value
   *  is an array of tel numbers of that type
   * @param tel tel number
   * @param emptyTelGroup object where each key is a tel number type (sms_phone, fixable, not_fixable)
   * @param valid true if the tel number is valid, false if is fixable or not fixable
   * @param fixable tel number fixed if possible, null if not
   * @param row position of the tel number in the array
   * @returns object where each key is a tel number type (sms_phone, fixable, not_fixable)
   */
  groupByTelType({
    tel,
    emptyTelGroup,
    valid,
    fixable,
    row,
  }: {
    tel: TelephoneNumberFormatted;
    valid: boolean;
    fixable: string | null;
    row: number;
    emptyTelGroup: TelephoneNumberGroup;
  }): TelephoneNumberGroup {
    tel = { ...tel, row };
    if (valid) {
      emptyTelGroup.valid.push(tel);
    } else if (fixable !== null) {
      emptyTelGroup.fixable.push({ ...tel, fixable });
    } else {
      emptyTelGroup.not_fixable.push(tel);
    }

    return emptyTelGroup;
  }

  /**
   * Remove letters and symbols from a string
   * @param str string
   * @returns string without letters and symbols
   */
  removeLettersInString(str: string) {
    return str.replace(/[a-zA-Z!@#_]/g, '');
  }
}
