import { defineConfig } from 'cypress';
import readExcelFile from './cypress/document-utils/read-excel';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: false,
    setupNodeEvents(on) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      // register utility tasks to read and parse Excel files
      on('task', {
        readExcelFile,
      });
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
