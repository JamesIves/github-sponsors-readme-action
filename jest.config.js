module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {tsconfig: 'tsconfig.test.json'}]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@exodus/bytes|html-encoding-sniffer|parse5|entities)/)'
  ],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!src/constants.ts'],
  automock: false,
  resetMocks: true,
  restoreMocks: true
}
