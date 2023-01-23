import { validateExcelFile } from 'cypress/e2e/utils';
import * as path from 'path';

const fixturePath = 'cypress/fixtures/';

function checkAlertForText({ text, done }: { text: string; done: () => void }) {
  cy.on('window:alert', alertText => {
    expect(alertText).to.eq(text);
    done();
  });
}
function uploadFile(filePath: string) {
  cy.get('[data-cy="upload-trigger"]').click();
  cy.get('[data-cy="file-upload"]').selectFile(fixturePath + filePath, {
    force: true,
  });
}

beforeEach(() => {
  cy.visit('/');
});

describe('TelCheckerComponent', () => {
  describe('List', () => {
    it('should show row position of tel in sheet', () => {
      cy.get('app-tel-item')
        .first()
        .get('[data-cy="position"]')
        .should('exist')
        .should('contain', `Position Row`);
    });
  });
  describe('List', () => {
    it('should show fixable value if exists', () => {
      cy.visit('/#fixable');
      cy.reload();
      cy.get('[data-cy="fixable"]').first().should('exist');
    });
  });
  describe('Upload', () => {
    it('should update tel list with new values if uploaded file is valid and display values', () => {
      cy.get('[data-cy="upload-trigger"]').click();
      uploadFile('valid_excel_4_item.xlsx');
      cy.get('app-tel-item').should('have.length', 1);
      cy.get('#fixable').click();
      cy.get('app-tel-item').should('have.length', 2);
      cy.get('#not_fixable').click();
      cy.get('app-tel-item').should('have.length', 1);
    });

    it('should have input file that uploads only single file, with extension .csv, .xlsx or .xls', () => {
      expect(
        cy
          .get('[data-cy="file-upload"]')
          .should(
            'have.attr',
            'accept',
            '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          )
      );
    });
    it(
      'should show alert error with text  File should have id and sms_phone headers if uploaded ' +
        'file doesnt have correct headers',
      done => {
        uploadFile('test_wrong_headers.xlsx');
        checkAlertForText({
          text: 'File should have id and sms_phone headers',
          done,
        });
      }
    );
    it('should show empty state for fixable if there are no fixable items', () => {
      uploadFile('no_fixable.xlsx');
      cy.get('#fixable').click();
      cy.get('[data-cy=list-no-data]').should(
        'have.text',
        'No data to display'
      );
    });
  });
  describe('Download', () => {
    it('should have button that triggers download file with extension .xlsx', () => {
      cy.get('[data-cy=download-trigger]').click();
      cy.log('**confirm downloaded file**');
      validateExcelFile();
    });
    it('should download file with name tel_list.csv and valid phones after upload of valid phone numbers', () => {
      uploadFile('valid_excel_4_item.xlsx');
      cy.get('[data-cy=download-trigger]').click();
      cy.log('**confirm downloaded file**');

      validateExcelFile();
    });
  });
  describe('tel checker', () => {
    it("should show error 'a valid south african telephone number has 11 digits' if user inputs tel number that has less than eleven digits ", () => {
      cy.get('[data-cy="tel-input"]').type('1234567890');
      cy.wait(1000);
      cy.get('[data-cy="input-error"]').should(
        'have.text',
        'a valid south african telephone number has 11 digits'
      );
    });
    it('should show alert  with text "Valid phone number" if telephone number is valid', done => {
      cy.get('[data-cy="tel-input"]').type('27123456789');
      checkAlertForText({ text: 'Valid phone number', done: done });
    });
    it('should show alert  with text "Invalid phone number" if telephone number is invalid and not fixable', done => {
      cy.get('[data-cy="tel-input"]').type('1734567891011');
      checkAlertForText({ text: 'Phone number not fixable', done: done });
    });
    it('should show alert "text is fixable with" and the value of the fixed tel, if telephone number is invalid but fixable', done => {
      cy.get('[data-cy="tel-input"]').type('173456289101');
      checkAlertForText({
        text: 'Phone number fixable to: 27134568910',
        done: done,
      });
    });
  });
});
