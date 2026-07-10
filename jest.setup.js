import '@testing-library/jest-native/extend-expect';

global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-image
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: ({ source, style, ...props }) => {
      return React.createElement(View, { style, testID: 'mock-image', ...props });
    },
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    replace: jest.fn(),
    dismissAll: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

// Mock window dimensions for layout/coordinates
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => {
  return jest.fn(() => ({ width: 375, height: 812 }));
});

// Silence warning logs in test runs
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0].includes('Warning: React does not recognize') ||
    args[0].includes('Warning: Failed prop type')
  ) {
    return;
  }
  originalConsoleError(...args);
};
