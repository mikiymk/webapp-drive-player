import { JSX, useContext } from "solid-js";
import { MenuContext } from "./MenuContext";

import { styleItem } from "./style.css";

export type MenuItemProps = {
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  children: string;
};

/** show on right click */
export const MenuItem = (props: MenuItemProps) => {
  const { closeMenu } = useContext(MenuContext);
  return (
    <button
      class={styleItem}
      onClick={event => {
        props.onClick(event);
        closeMenu();
      }}>
      {props.children}
    </button>
  );
};
