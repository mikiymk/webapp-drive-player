import type { JSXElement } from "solid-js";
import { render as solidRender } from "solid-js/web";
import { vi } from "vitest";

export const render = (component: () => JSXElement) => {
  const container = document.body.appendChild(document.createElement("div"));
  solidRender(component, container);
  return {
    container,
    unmount: () => document.body.removeChild(container),
  };
};

export const mockCSS = () => {
  vi.mock("@vanilla-extract/css", () => {
    return {
      style: vi.fn(() => "style-class"),
    };
  });
};
