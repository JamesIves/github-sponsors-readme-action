module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {tsconfig: 'tsconfig.test.json', diagnostics: false}
    ]
  },
  // @actions/core@3.0.0 is ESM-only (no "require" export condition).
  // moduleNameMapper redirects the specifier to a local CJS stub so Jest's CJS
  // runtime can resolve it. Individual test files call jest.mock('@actions/core',
  // factory) to override the stub; jest.mock factories always take precedence
  // over the mapped module content.
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__mocks__/@actions/core.cjs',
    '^(\\.{1,2}/.*)\\.js$': '$1'
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
