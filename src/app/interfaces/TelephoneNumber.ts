export type TelephoneNumberFormatted = TelephoneNumber & {
  /** Position inside the array of telephone numbers */
  row?: number;
  /** Fixed telephone number */
  fixable?: string | null;
  /** Telephone number that cannot be fixed */
  not_fixable?: string | null;
};

export type TelephoneNumber = {
  id: string;
  /** Telephone number form csv */
  sms_phone: number;
};

export type TelephoneNumberGroup = {
  [id in TelFormatType]: TelephoneNumberFormatted[];
};

export type TelFormatType = 'fixable' | 'not_fixable' | 'valid';
