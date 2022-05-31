import { JSXElement, useContext } from "solid-js";

import { IconClose } from "~/components/Icon";
import { createRef } from "~/hooks/createRef";

import { MenuContext } from "./MenuContext";
import { styleRightMenu } from "./style.css";
import { getMenuSize } from "./getMenuSize";

export type MenuProps = {
  children: JSXElement;
};

/** show on right click */
export const Menu = (props: MenuProps) => {
  const [current, ref] = createRef<HTMLDivElement>();
  const { top, left, visible, closeMenu } = useContext(MenuContext);

  return (
    <div
      class={styleRightMenu}
      style={{
        visibility: visible() ? "visible" : "hidden",
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
      <button onclick={() => closeMenu()}>
        <IconClose />
      </button>
      <hr></hr>
      {props.children}
    </div>
  );
};
