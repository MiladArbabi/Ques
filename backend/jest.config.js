module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/tests',         // your integration tests
    '<rootDir>/adapters',      // all adapter unit tests
    '<rootDir>/services',      // your service tests
  ],
  testMatch: [
    '**/?(*.)+(spec|test).ts'  // pick up *.test.ts or *.spec.ts everywhere
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // if you need transforms:
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 100,
      lines: 100,
      statements: 90,
    },
    './services/shopify/cache.ts': {
      branches: 75,
    },
  },
};
