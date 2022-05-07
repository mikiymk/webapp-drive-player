import { createSignal, For, JSXElement } from "solid-js";

import Authorize from "./Authorize";
import LabelIcon from "./LabelIcon";
import {
  styleMenu,
  styleContent,
  styleNav,
  styleNavItem,
  styleNavSelected,
} from "./style.css";

type Props = {
  items: {
    [name: string]: { name: string; icon: JSXElement; element: JSXElement };
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
    <div class={styleMenu}>
      <ul class={styleNav}>
        <For each={Object.entries(props.items)}>
          {([id, item]) => (
            <li
              classList={{
                [styleNavItem]: true,
                [styleNavSelected]: id === selected(),
              }}>
              <button onClick={() => setSelected(id)}>
                <LabelIcon icon={item.icon}>{item.name}</LabelIcon>
              </button>
            </li>
          )}
        </For>
        <Authorize auth={props.auth} />
      </ul>
      <div class={styleContent}>{props.items[selected()]?.element}</div>
    </div>
  );
};

export default Menu;
