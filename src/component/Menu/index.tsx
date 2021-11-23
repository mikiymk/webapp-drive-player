import React from "react";

/**
 * menu list click menu and change view
 */
const Menu: React.FC<{
  items: Map<string, { name: string; element: JSX.Element }>;
  authorize: JSX.Element;
}> = ({ authorize, items }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Array.from(items).map(([id, { name }]) => (
    <li key={id} id={id}>
      <a href={"#" + id} onClick={() => setSelected(id)}>
        {name}
      </a>
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
