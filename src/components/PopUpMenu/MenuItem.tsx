import { useContext } from "solid-js";

import { MenuContext } from "./MenuContext";
import { menuItem } from "./style.css";

import type { JSX } from "solid-js";

interface MenuItemProps {
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  children: string;
}

/** show on right click */
export const MenuItem = (props: MenuItemProps) => {
  const { closeMenu } = useContext(MenuContext);
  return (
    <div class={menuItem}>
      <button
        type="button"
        onClick={(event) => {
          props.onClick(event);
          closeMenu();
        }}
      >
        {props.children}
      </button>
    </div>
  );
};
