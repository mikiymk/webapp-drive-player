import { Show, useContext } from "solid-js";

import { IconClose } from "~/components/Icon";
import { createRef } from "~/hooks/createRef";

import { MenuContext } from "./MenuContext";
import { MenuSeparator } from "./MenuSeparator";
import { getMenuSize } from "./getMenuSize";
import { rightMenu } from "./style.css";

import type { JSXElement } from "solid-js";

interface MenuProps {
  children: JSXElement;
}

/** show on right click */
export const Menu = (props: MenuProps) => {
  const [current, ref] = createRef<HTMLDivElement>();
  const { top, left, visible, closeMenu } = useContext(MenuContext);

  return (
    <Show when={visible()}>
      <div
        class={rightMenu}
        style={{
          top: getMenuSize(
            top(),
            current()?.clientHeight ?? 0,
            window.innerHeight,
          ),
          left: getMenuSize(
            left(),
            current()?.clientWidth ?? 0,
            window.innerWidth,
          ),
        }}
        ref={ref}
      >
        <button
          type="button"
          onClick={() => {
            closeMenu();
          }}
        >
          <IconClose />
        </button>
        <MenuSeparator />
        {props.children}
      </div>
    </Show>
  );
};
