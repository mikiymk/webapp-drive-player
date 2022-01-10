import React from "react";

import LabelIcon from "component/Common/LabelIcon";

import Authorize from "./Authorize";

type Props = {
  items: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  };
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
};

/**
 * menu list click menu and change view
 */
const Menu: React.FC<Props> = ({ items, signIn, setSignIn }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Object.entries(items).map(([id, { name, icon }]) => (
    <li
      key={id}
      className={id === selected ? "menu-left-selected" : ""}
      onClick={() => setSelected(id)}>
      <LabelIcon icon={icon} text={name} />
    </li>
  ));

  return (
    <div className="menu-container">
      <ul className="menu-left">
        {menuList}
        <Authorize signIn={signIn} setSignIn={setSignIn} />
      </ul>
      <div className="menu-right">{items[selected]?.element ?? null}</div>
    </div>
  );
};

export default Menu;
