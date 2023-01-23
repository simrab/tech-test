module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {
    '^@environments/(.*)$': '<rootDir>/environments/$1',
    '^@views/(.*)$': '<rootDir>/src/app/views/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/app/interfaces/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@assets/(.*)$': '<rootDir>/src/app/assets/$1',
    '^@pipes/(.*)$': '<rootDir>/src/app/pipes/$1',
    '^@mocks/(.*)$': '<rootDir>/mocks/$1',
  },
};
