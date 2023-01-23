import { TestBed } from '@angular/core/testing';
import {
  TelephoneNumber,
  TelephoneNumberFormatted,
  TelephoneNumberGroup,
} from '@interfaces/TelephoneNumber';

import { TelformatterService } from './telformatter.service';

const fakeData: TelephoneNumberGroup = {
  valid: [
    { id: '1', sms_phone: 27111111111, row: 1 },
    { id: '2', sms_phone: 27111111121, row: 2 },
    { id: '3', sms_phone: 27111111131, row: 3 },
  ],
  not_fixable: [
    { id: '13', sms_phone: 211111111 },
    { id: '12', sms_phone: 2911111112 },
    { id: '11', sms_phone: 21111111113 },
  ],
  fixable: [
    { id: '8', sms_phone: 271111111134, fixable: '27111111113', row: 8 },
    { id: '9', sms_phone: 271111111134, fixable: '27111111125', row: 9 },
    { id: '10', sms_phone: 271111111134, fixable: '27111111137', row: 10 },
  ],
};

const incorrectNumber = '2711la_el111111';

const expectedData: TelephoneNumber[] = [
  { id: '1', sms_phone: 27111111111 },
  { id: '2', sms_phone: 27111111121 },
  { id: '3', sms_phone: 27111111131 },
  { id: '8', sms_phone: 27111111113 },
  { id: '9', sms_phone: 27111111125 },
  { id: '10', sms_phone: 27111111137 },
];

const fakeValidPaylodGroupByTellType: {
  tel: TelephoneNumberFormatted;
  valid: boolean;
  fixable: string | null;
  row: number;
  emptyTelGroup: TelephoneNumberGroup;
} = {
  tel: { id: '1', sms_phone: 271111111111, row: 1 },
  valid: true,
  fixable: null,
  row: 1,
  emptyTelGroup: {
    valid: [],
    not_fixable: [],
    fixable: [],
  },
};

const fakeFixablePaylodGroupByTellType: typeof fakeValidPaylodGroupByTellType =
  {
    tel: { id: '1', sms_phone: 127111111111, row: 1 },
    valid: false,
    fixable: '271111111111',
    row: 1,
    emptyTelGroup: {
      valid: [],
      not_fixable: [],
      fixable: [],
    },
  };

const fakeNotFixablePaylodGroupByTellType: typeof fakeValidPaylodGroupByTellType =
  {
    tel: { id: '1', sms_phone: 1111111111111111, row: 1 },
    valid: false,
    fixable: null,
    row: 1,
    emptyTelGroup: {
      valid: [],
      not_fixable: [],
      fixable: [],
    },
  };

describe('TelformatterService', () => {
  let service: TelformatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelformatterService);
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('createExcelFileData should return valid data if telephone group is passed', () => {
    expect(service.createExcelFileData(fakeData)).toMatchObject(expectedData);
  });
  it('removeLettersInString should return a string without letters or symbold', () => {
    expect(service.removeLettersInString(incorrectNumber)).toBe('2711111111');
  });
  describe('groupByTelType', () => {
    it('should put valid values inside telephone group valid array', () => {
      expect(
        service.groupByTelType(fakeValidPaylodGroupByTellType)
      ).toMatchObject({
        valid: [{ id: '1', sms_phone: 271111111111, row: 1 }],
        not_fixable: [],
        fixable: [],
      });
    });
    it('should put fixed values inside fixed group array with original value', () => {
      expect(
        service.groupByTelType(fakeFixablePaylodGroupByTellType)
      ).toMatchObject({
        valid: [],
        not_fixable: [],
        fixable: [
          {
            id: '1',
            sms_phone: 127111111111,
            fixable: '271111111111',
            row: 1,
          },
        ],
      });
    });
    it('should put not fixable values inside not_fixable group array', () => {
      expect(
        service.groupByTelType(fakeNotFixablePaylodGroupByTellType)
      ).toMatchObject({
        valid: [],
        not_fixable: [{ id: '1', sms_phone: 1111111111111111, row: 1 }],
        fixable: [],
      });
    });
  });
  describe('formatTels', () => {
    it('should return group telephone numbers based on their validity', () => {
      const spy = jest.spyOn(service, 'groupByTelType');
      /** It should call groupByTelType for each element in tels array */
      service.formatTels(expectedData);
      expect(spy).toHaveBeenCalledTimes(expectedData.length);
      expect(service.formatTels(expectedData)).toMatchObject({
        fixable: [],
        not_fixable: [],
        valid: expectedData,
      });
    });
  });
  describe('fixTel', () => {
    it('should return an object with propetry fixable with the fixed phone number, if possible, and not_fixable null', () => {
      expect(service.fixTel(234567891011)).toMatchObject({
        fixable: '27345689101',
        not_fixable: null,
      });
    });
    it('should return an object with propetry fixable null, if fix is not possible, and not_fixable with the phone value', () => {
      expect(service.fixTel(111111111111111)).toMatchObject({
        fixable: null,
        not_fixable: '111111111111111',
      });
    });
  });
  describe('isTelCorrect', () => {
    it('should return true if tel is correct', () => {
      expect(service.isTelCorrect(27111111111)).toBe(true);
    });
    it('should return false if tel is not correct and not fixable', () => {
      expect(service.isTelCorrect(111111111111111)).toBe(false);
    });
  });
});
