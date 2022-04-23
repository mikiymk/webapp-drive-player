import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import LabelIcon from "~/components/LabelIcon";

import {
  styleMenu,
  styleContent,
  styleNav,
  styleNavItem,
  styleNavSelected,
} from "./style.css";
import Authorize from "~/components/Authorize";

type Props = {
  items: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  };
};

/**
 * menu list click menu and change view
 */
const RouteMenu: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = React.useState("playing");

  const menuList = Object.entries(items).map(([id, { name, icon }]) => (
    <Link
      key={id}
      className={
        id === selected ? `${styleNavItem} ${styleNavSelected}` : styleNavItem
      }
      to={id}>
      <LabelIcon icon={icon} text={name} />
    </Link>
  ));

  const itemList = Object.entries(items).map(([id, { element }]) => (
    <Route key={id} path={id} element={element} />
  ));

  return (
    <BrowserRouter>
      <div className={styleMenu}>
        <nav className={styleNav}>
          {menuList}
          <Authorize style={styleNavItem} />
        </nav>
        <div className={styleContent}>
          <Routes>{itemList}</Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default RouteMenu;
