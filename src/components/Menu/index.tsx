import React from "react";

import LabelIcon from "~/components/LabelIcon";

import Authorize from "../Authorize";
import {
  styleMenu,
  styleContent,
  styleNav,
  styleNavItem,
  styleNavSelected,
} from "./style.css";

type Props = {
  items: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  };

  auth: {
    accessToken: string;
    isSignIn: boolean;
    signIn: () => void;
    signOut: () => void;
  };
};

/**
 * menu list click menu and change view
 */
const Menu: React.FC<Props> = ({ items, auth }) => {
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
    <div className={styleMenu}>
      <ul className={styleNav}>
        {menuList}
        <Authorize style={styleNavItem} auth={auth} />
      </ul>
      <div className={styleContent}>{items[selected]?.element ?? null}</div>
    </div>
  );
};

export default Menu;
