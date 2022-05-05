import { test, expect, describe } from "vitest";
import { mockCSS, render } from "~/test/helper";

import Icon from "../GoogleIcon";

describe("<Icon />", () => {
  mockCSS();

  test("icon component test", () => {
    const { container, unmount } = render(() => <Icon icon="icon" />);

    expect(container.innerHTML).toMatchSnapshot();

    unmount();
  });
});
