import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const tab = style({
  flex: "0 0 max-content",
  backgroundColor: vars.color.prim,
  textAlign: "center",
});

export const tabItem = style({
  display: "inline-block",
});

export const tabItemButton = style({
  padding: "0.5rem",
  whiteSpace: "nowrap",

  selectors: {
    "&:hover": {
      backgroundColor: vars.color.hoverShadow,
    },
  },
});

export const tabItemLabel = style({
  display: "none",
  marginLeft: "0.5rem",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});

export const tabItemSelected = style({
  backgroundColor: vars.color.primLight,
});

export const content = style({
  flex: "1 0 0",
  backgroundColor: vars.color.primLight,
  display: "flex",
  flexDirection: "column",
});
