import React from "react";
import renderer from "react-test-renderer";
import Icon from "../component/Common/Icon";

jest.mock("@linaria/core", () => {
  return {
    css: jest.fn(() => "style-class"),
  };
});

test("icon component test", () => {
  const component = renderer.create(
    React.createElement(Icon, { icon: "icon" })
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
