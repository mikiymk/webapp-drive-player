import { createSignal, createContext, JSXElement } from "solid-js";
import { RightMenu } from "./RightMenu";
import type Item from "./Item";

export type ButtonClickEvent = MouseEvent & {
  currentTarget: HTMLButtonElement;
  target: Element;
};
export type PopMenu = (
  data: Item[],
  e: MouseEvent & {
    currentTarget: HTMLButtonElement;
    target: Element;
  }
) => void;

export const Context = createContext<PopMenu>(() => () => {});

export type RightMenuProviderProps = {
  children: JSXElement;
};

export const RightMenuProvider = (props: RightMenuProviderProps) => {
  const [items, setItems] = createSignal<Item[]>([]);
  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  const setRightMenu: PopMenu = (items: Item[], event) => {
    console.log(items, event);
    setItems(items);
    setTop(event.clientY);
    setLeft(event.clientX);
  };

  return (
    <Context.Provider value={setRightMenu}>
      {props.children}
      <RightMenu items={items()} top={top()} left={left()} />
    </Context.Provider>
  );
};
