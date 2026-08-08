module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    // Map .js relative imports back to source .ts files for ts-jest
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.(ts|js|mjs)$': [
      'ts-jest',
      {
        tsconfig: {module: 'commonjs', moduleResolution: 'node', allowJs: true}
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*(@exodus/bytes|@asamuzakjp|@csstools|html-encoding-sniffer|parse5|entities)/)'
  ],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!src/constants.ts'],
  automock: false,
  resetMocks: true,
  restoreMocks: true
}
