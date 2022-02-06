import { createContext, MouseEvent } from "react";
import Item from "./Item";

const Context = createContext((_: Item[]) => (_: MouseEvent) => {});

export default Context;
