module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/main.ts',
      '!src/**/*.module.ts',
    ],
    coverageDirectory: './coverage',
    testTimeout: 10000,
  };