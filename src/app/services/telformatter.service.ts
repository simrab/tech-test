import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TelformatterService {
  /** Correct format for a south african mobile phone number is  (+27 AA XXX XXXX). Es:27 83 123 4567
   * ("https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers#South_Africa") */
  constructor() {}
}
