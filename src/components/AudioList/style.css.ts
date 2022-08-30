import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const sList = style({
  width: "100%",
  overflowY: "scroll",
});

export const sHead = style({
  background: vars.color.primDark,
  position: "sticky",
  top: 0,
});

export const sBody = style({
  height: "100%",
});

export const sItem = style({
  borderBottom: "solid 1px " + vars.color.prim,
});

export const sItemArtist = style({
  display: "none",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});

export const sDot = style({
  width: "1rem",
});
