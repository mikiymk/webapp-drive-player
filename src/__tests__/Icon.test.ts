import React from "react";
import renderer from "react-test-renderer";
import Icon from "../component/Common/Icon";

test("icon component test", () => {
  const component = renderer.create(
    React.createElement(Icon, { icon: "icon", className: "test-class-name" })
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
