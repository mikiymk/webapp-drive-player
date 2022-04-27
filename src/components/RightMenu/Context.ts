import { JSX, createContext } from "solid-js";
import Item from "./Item";

const Context = createContext<
  (item: Item[]) => JSX.EventHandler<HTMLButtonElement, MouseEvent>
>(() => () => {});

export default Context;
