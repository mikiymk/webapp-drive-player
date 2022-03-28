import { createContext, MouseEvent } from "react";
import Item from "./Item";

const Context = createContext((item: Item[]) => (event: MouseEvent) => {});

export default Context;
