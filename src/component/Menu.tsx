import React from "react";
import Authorize from "./Authorize";

const Menu: React.FC<{
  onSignIn: () => void;
  items: { [name: string]: { name: string; element: JSX.Element } };
}> = ({ onSignIn, items }) => {
  const [selected, setSelected] = React.useState("playing");

  const itemsList = Object.entries(items).map(([name, value]) =>
    name === selected ? value.element : null
  );

  const menuList = Object.entries(items).map(([name, value]) => (
    <li id={name}>
      <a href={"#" + name} onClick={() => setSelected(name)}>
        {value.name}
      </a>
    </li>
  ));

  return (
    <div>
      <ul>
        {menuList}
        <li>
          <Authorize onSignIn={onSignIn} />
        </li>
      </ul>
      {itemsList}
    </div>
  );
};

export default Menu;
