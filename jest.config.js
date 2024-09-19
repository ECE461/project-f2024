module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['/**/src/test/**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', 'run'],
    coverageReporters: ['json'],
    coveragePathIgnorePatterns: ['src/commands/test.ts']
  };