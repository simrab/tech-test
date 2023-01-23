import * as path from 'path';

// From:https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__download/cypress/e2e/utils.js
export const validateExcelFile = (expectedNumbers?: string[]) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(
    downloadsFolder,
    'valid_tel_numbers.xlsx'
  );
  // ensure the file has been saved before trying to parse it
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should(
    buffer => {
      // by having length assertion we ensure the file has text
      // since we don't know when the browser finishes writing it to disk

      // Tip: use expect() form to avoid dumping binary contents
      // of the buffer into the Command Log
      expect(buffer.length).to.be.gt(100);
    }
  );
  cy.log('**the file exists**');
  // the first utility library we use to parse Excel files
  // only works in Node, thus we can read and parse
  // the downloaded file using cy.task
  cy.task('readExcelFile', downloadedFilename).then(list => {
    expect((list as string[])[0], 'header line').to.deep.equal([
      'id',
      'sms_phone',
    ]);
    if (expectedNumbers) {
      list[1].forEach((item: string, i: number) => {
        expect(item, 'phone number').to.equal(expectedNumbers[i]);
      });
    }
  });
};
