import '@testing-library/jest-native/extend-expect';

(global as any).__DEV__ = true;

if (!(global as any).performance) {
  (global as any).performance = {
    now: Date.now,
  };
}

