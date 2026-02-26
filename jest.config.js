module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-vector-icons|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native-async-storage/async-storage|@tanstack/react-query))",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@types/(.*)$": "<rootDir>/types/$1",
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/__mocks__/@react-native-async-storage/async-storage.ts",
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/app/**",
  ],
};
