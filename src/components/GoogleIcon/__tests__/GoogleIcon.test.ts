import React from "react";
import renderer from "react-test-renderer";
import { renderToString } from "solid-js/web";
import Icon from "../index";

jest.mock("@vanilla-extract/css", () => {
  return {
    style: jest.fn(() => "style-class"),
  };
});

test("icon component test", () => {
  const component = renderToString(() => Icon({ icon: "icon" }));

  expect(component).toMatchSnapshot();
});
