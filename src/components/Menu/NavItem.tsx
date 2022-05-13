import type { JSXElement } from "solid-js";
import {
  styleLabel,
  styleNavItem,
  styleNavItemButton,
  styleNavSelected,
} from "./style.css";

type Props = {
  icon: JSXElement;
  selected?: boolean;
  onClick: () => void;
  children: string;
};

/** Google Material Icon テキスト付き */
const NavItem = (props: Props) => {
  return (
    <li
      classList={{
        [styleNavItem]: true,
        [styleNavSelected]: props.selected,
      }}>
      <button class={styleNavItemButton} onClick={() => props.onClick()}>
        {props.icon}
        <span class={styleLabel}>{props.children}</span>
      </button>
    </li>
  );
};

export default NavItem;
