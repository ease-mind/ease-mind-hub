import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("@repo/data-access", async () => {
  const actual = await vi.importActual("@repo/data-access");
  return {
    ...actual,
    api: {
      get: vi.fn(() => Promise.resolve({ data: [] })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      patch: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve()),
    },
    CognitiveSettingsProvider: ({ children }: { children: React.ReactNode }) => 
      React.createElement("div", { "data-testid": "cognitive-settings-provider" }, children),
    useCognitiveSettings: () => ({
      settings: {
        fontSize: "medium",
        contrast: "normal",
        spacing: "normal",
        animations: true,
      },
      updateSettings: vi.fn(),
    }),
  };
});

global.jest = vi;
