jest.mock("@react-native-async-storage/async-storage");

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return RN;
});

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  return Reanimated;
});

const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};
