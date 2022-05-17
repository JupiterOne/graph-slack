module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 50,
      functions: 100,
      lines: 90,
    },
  },
};
