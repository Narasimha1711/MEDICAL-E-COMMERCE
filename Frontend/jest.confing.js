module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transform JS/JSX/TS/TSX files with babel-jest
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
      '^../config$': '<rootDir>/__mocks__/config.js'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!.*\\.jsx?$)', // Transform JSX in node_modules if needed
    ],
    testMatch: ['<rootDir>/tests/**/*.(test|spec).(js|jsx|ts|tsx)'],
  };