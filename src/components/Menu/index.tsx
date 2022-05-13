import {
  Accessor,
  createContext,
  createRenderEffect,
  createSignal,
  For,
  JSXElement,
  Show,
  useContext,
} from "solid-js";

import Authorize from "./Authorize";
import LabelIcon from "./LabelIcon";
import {
  styleMenu,
  styleContent,
  styleNav,
  styleNavItem,
  styleNavSelected,
} from "./style.css";

type MenuItem = {
  key: string;
  icon: JSXElement;
  label: string;
};

const MenuContext = createContext<{
  selected: Accessor<string>;
  addItem: (key: string, icon: JSXElement, label: string) => void;
}>({
  selected: () => "",
  addItem: () => {},
});

type Props = {
  defaultKey: string;
  auth: {
    accessToken: string;
    signIn: () => void;
    signOut: () => void;
  };
  children: JSXElement;
};

/**
 * menu list click menu and change view
 */
export const Menu = (props: Props) => {
  const [selected, setSelected] = createSignal(props.defaultKey);
  const [items, setItems] = createSignal<MenuItem[]>([]);

  const addItem = (key: string, icon: JSXElement, label: string) => {
    setItems(items => {
      if (items.some(item => item.key === key)) {
        return items;
      } else {
        return [...items, { key, icon, label }];
      }
    });
  };

  return (
    <MenuContext.Provider value={{ selected, addItem }}>
      <div class={styleMenu}>
        <ul class={styleNav}>
          <For each={items()}>
            {item => (
              <li
                classList={{
                  [styleNavItem]: true,
                  [styleNavSelected]: item.key === selected(),
                }}>
                <button onClick={() => setSelected(item.key)}>
                  <LabelIcon icon={item.icon}>{item.label}</LabelIcon>
                </button>
              </li>
            )}
          </For>
          <Authorize auth={props.auth} />
        </ul>
        <div class={styleContent}>{props.children}</div>
      </div>
    </MenuContext.Provider>
  );
};

type PropsItem = {
  key: string;
  icon: JSXElement;
  label: string;
  children: JSXElement;
};

export const MenuItem = (props: PropsItem) => {
  const menu = useContext(MenuContext);

  createRenderEffect(() => {
    menu.addItem(props.key, props.icon, props.label);
  });

  return <Show when={menu.selected() === props.key}>{props.children}</Show>;
};
