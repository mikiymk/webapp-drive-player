import {
  tabItemLabel,
  tabItem,
  tabItemButton,
  tabItemSelected,
} from "./style.css";

import type { JSXElement } from "solid-js";

export interface Props {
  icon: JSXElement;
  selected?: boolean;
  onClick: () => void;
  children: string;
}

/** Google Material Icon テキスト付き */
export const NavItem = (props: Props) => {
  return (
    <li
      classList={{
        [tabItem]: true,
        [tabItemSelected]: props.selected,
      }}
    >
      <button class={tabItemButton} onClick={() => props.onClick()}>
        {props.icon}
        <span class={tabItemLabel}>{props.children}</span>
      </button>
    </li>
  );
};
