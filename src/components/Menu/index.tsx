import { createSignal, For, JSX } from "solid-js";

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
    signIn: () => void;
    signOut: () => void;
  };
};

/**
 * menu list click menu and change view
 */
const Menu = (props: Props) => {
  const [selected, setSelected] = createSignal("playing");

  return (
    <div className={styleMenu}>
      <ul className={styleNav}>
        <For each={Object.entries(props.items)}>
          {([id, item]) => (
            <li
              classList={{
                [styleNavItem]: true,
                [styleNavSelected]: id === selected(),
              }}
              onClick={() => setSelected(id)}>
              <LabelIcon icon={item.icon} text={item.name} />
            </li>
          )}
        </For>
        <Authorize style={styleNavItem} auth={props.auth} />
      </ul>
      <div className={styleContent}>{props.items[selected()]?.element}</div>
    </div>
  );
};

export default Menu;
