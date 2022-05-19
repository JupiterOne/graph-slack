module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 95,
      functions: 100,
      lines: 95,
    },
  },
};
