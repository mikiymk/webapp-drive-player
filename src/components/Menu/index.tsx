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

import { Authorize } from "./Authorize";
import { NavItem } from "./NavItem";
import { styleContent, styleNav } from "./style.css";

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
  addItem: () => 0,
});

export type MenuProps = {
  defaultKey: string;

  isSignIn: boolean;
  signIn: () => void;
  signOut: () => void;

  children: JSXElement;
};

/**
 * menu list click menu and change view
 */
export const Menu = (props: MenuProps) => {
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
      <ul class={styleNav}>
        <For each={items()}>
          {item => (
            <NavItem
              icon={item.icon}
              onClick={() => setSelected(item.key)}
              selected={item.key === selected()}>
              {item.label}
            </NavItem>
          )}
        </For>
        <Authorize {...props} />
      </ul>
      <div class={styleContent}>{props.children}</div>
    </MenuContext.Provider>
  );
};

export type MenuItemProps = {
  key: string;
  icon: JSXElement;
  label: string;
  children: JSXElement;
};

export const MenuItem = (props: MenuItemProps) => {
  const menu = useContext(MenuContext);

  createRenderEffect(() => {
    menu.addItem(props.key, props.icon, props.label);
  });

  return <Show when={menu.selected() === props.key}>{props.children}</Show>;
};
