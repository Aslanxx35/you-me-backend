module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/services/ephemeris.service.ts','src/services/scoring.service.ts','src/services/astro/moonPhase.service.ts','src/services/composite.service.ts','src/services/transit.service.ts'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  },
  moduleFileExtensions: ['ts', 'js'],
  clearMocks: true
};
