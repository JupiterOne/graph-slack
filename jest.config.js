module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 100,
      lines: 50,
    },
  },
};
