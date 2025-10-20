import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Suppress MUI prop warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("React does not recognize the `%s` prop on a DOM element") ||
        args[0].includes("Received `%s` for a non-boolean attribute `%s`"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

afterEach(() => {
  cleanup();
});
