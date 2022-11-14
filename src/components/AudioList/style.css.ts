import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const list = style({
  width: "100%",
  overflowY: "scroll",
});

export const head = style({
  background: vars.color.primDark,
  position: "sticky",
  top: 0,
});

export const body = style({
  height: "100%",
});

export const item = style({
  borderBottom: "solid 1px " + vars.color.prim,
});

export const itemArtist = style({
  display: "none",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});

export const itemMore = style({
  width: "1rem",
});
