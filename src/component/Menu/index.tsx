import React from "react";

import LabelIconButton from "../Common/LabelIconButton";

type Props = {
  items: Map<string, { name: string; icon: string; element: JSX.Element }>;
  authorize: JSX.Element;
};

/**
 * menu list click menu and change view
 */
const Menu: React.FC<Props> = ({ authorize, items }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Array.from(items).map(([id, { name, icon }]) => (
    <li key={id}>
      <LabelIconButton
        icon={icon}
        text={name}
        onClick={() => setSelected(id)}
      />
    </li>
  ));

  return (
    <div className="menu-container">
      <ul className="menu-left">
        {menuList}
        <li>{authorize}</li>
      </ul>
      <div className="menu-right">{items.get(selected)?.element ?? null}</div>
    </div>
  );
};

export default Menu;
