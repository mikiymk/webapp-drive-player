import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const styleRightMenu = style({
  position: "fixed",

  top: 0,
  left: 0,

  backgroundColor: vars.color.seco,

  minWidth: "10rem",
});

export const styleSubMenu = style({
  position: "absolute",
  left: "0",

  backgroundColor: vars.color.seco,
  border: "solid 1px " + vars.color.secoDark,

  overflow: "hidden scroll",
  textOverflow: "ellipsis",
  minWidth: "10rem",
});

export const styleItem = style({
  margin: "0.5rem",
});

export const styleHorizon = style({
  height: 0,
  width: "100%",
  borderBottom: "solid 1px " + vars.color.secoDark,
  margin: "0.2rem",
});
