import { Show, useContext } from "solid-js";

import { IconClose } from "~/components/Icon";
import { createRef } from "~/hooks/createRef";

import { MenuContext } from "./MenuContext";
import { MenuSeparator } from "./MenuSeparator";
import { getMenuSize } from "./getMenuSize";
import { styleRightMenu } from "./style.css";

import type { JSXElement } from "solid-js";

export type MenuProps = {
  children: JSXElement;
};

/** show on right click */
export const Menu = (props: MenuProps) => {
  const [current, ref] = createRef<HTMLDivElement>();
  const { top, left, visible, closeMenu } = useContext(MenuContext);

  return (
    <Show when={visible()}>
      <div
        class={styleRightMenu}
        style={{
          top: getMenuSize(
            top(),
            current()?.clientHeight ?? 0,
            window.innerHeight
          ),
          left: getMenuSize(
            left(),
            current()?.clientWidth ?? 0,
            window.innerWidth
          ),
        }}
        ref={ref}>
        <button onClick={() => closeMenu()}>
          <IconClose />
        </button>
        <MenuSeparator />
        {props.children}
      </div>
    </Show>
  );
};
