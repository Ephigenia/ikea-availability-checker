/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  detectOpenHandles: true,
  // enable collection of code-coverage
  collectCoverage: true,
  coverageReporters: [
    // show a short summary on each test run
    'text-summary',
    'text',
    // creates "coverage" directory and "coverage/lcov.info" &
    // "/coverage/lcov-report"
    'lcov'
  ],
};

module.exports = config;
