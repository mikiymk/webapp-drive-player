import React from "react";
import { css } from "@linaria/core";

import LabelIcon from "components/LabelIcon";

import Authorize from "./Authorize";

const style = css`
  display: flex;
  flex: 0 1 100vh;
  overflow: hidden;

  &-left {
    flex: 0 0 max-content;
    padding-top: 4rem;
    background-color: rgb(165, 165, 165);

    &-item {
      cursor: pointer;
      margin: 0.3rem 0rem;
      padding: 0.2rem 0.5rem;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }

      &-selected {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  &-right {
    flex: 1 1 content;

    background-color: rgb(207, 207, 207);

    overflow-wrap: anywhere;
  }
`;

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
      className={
        id === selected
          ? `${style}-left-item ${style}-left-item-selected`
          : `${style}-left-item`
      }
      onClick={() => setSelected(id)}>
      <LabelIcon icon={icon} text={name} />
    </li>
  ));

  return (
    <div className={style}>
      <ul className={`${style}-left`}>
        {menuList}
        <Authorize
          signIn={signIn}
          setSignIn={setSignIn}
          style={`${style}-left-item`}
        />
      </ul>
      <div className={`${style}-right`}>{items[selected]?.element ?? null}</div>
    </div>
  );
};

export default Menu;
