import React from "react";

import LabelIcon from "components/LabelIcon";

import Authorize from "../Authorize";
import {
  style,
  styleContent,
  styleNav,
  styleNavItem,
  styleNavSelected,
} from "./style";

type Props = {
  items: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  };
};

/**
 * menu list click menu and change view
 */
const Menu: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Object.entries(items).map(([id, { name, icon }]) => (
    <li
      key={id}
      className={
        id === selected ? `${styleNavItem} ${styleNavSelected}` : styleNavItem
      }
      onClick={() => setSelected(id)}>
      <LabelIcon icon={icon} text={name} />
    </li>
  ));

  return (
    <div className={style}>
      <ul className={styleNav}>
        {menuList}
        <Authorize style={styleNavItem} />
      </ul>
      <div className={styleContent}>{items[selected]?.element ?? null}</div>
    </div>
  );
};

export default Menu;
