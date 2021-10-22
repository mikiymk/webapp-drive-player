import React from "react";

const Menu: React.FC<{
  items: Map<string, { name: string; element: JSX.Element }>;
  authorize: JSX.Element;
}> = ({ authorize, items }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Array.from(items).map(([name, value]) => (
    <li key={name} id={name}>
      <a href={"#" + name} onClick={() => setSelected(name)}>
        {value.name}
      </a>
    </li>
  ));

  return (
    <div>
      <ul>
        {menuList}
        <li>{authorize}</li>
      </ul>
      {items.get(selected) ?? null}
    </div>
  );
};

export default Menu;
