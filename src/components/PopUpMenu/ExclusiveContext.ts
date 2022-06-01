import { createContext } from "solid-js";

export type ExclusiveContextType = {
  apply: (closeMenu: () => void) => void;
  remove: (closeMenu: () => void) => void;
  close: () => void;
};

export const ExclusiveContext = createContext<ExclusiveContextType>({
  apply: () => {
    // no effect
  },
  remove: () => {
    // no effect
  },
  close: () => {
    // no effect
  },
});
