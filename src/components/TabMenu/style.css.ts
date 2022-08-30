import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const styleNav = style({
  flex: "0 0 max-content",
  backgroundColor: vars.color.prim,
  textAlign: "center",
});

export const styleNavItem = style({
  display: "inline-block",
});

export const styleNavItemButton = style({
  padding: "0.5rem",
  whiteSpace: "nowrap",

  selectors: {
    "&:hover": {
      backgroundColor: vars.color.hoverShadow,
    },
  },
});

export const styleNavSelected = style({
  backgroundColor: vars.color.primLight,
});

export const styleContent = style({
  flex: "1 0 0",
  backgroundColor: vars.color.primLight,
  display: "flex",
  flexDirection: "column",
});

export const styleLabel = style({
  display: "none",
  marginLeft: "0.5rem",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});
