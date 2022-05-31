import { style } from "@vanilla-extract/css";

export const styleRightMenu = style({
  position: "fixed",
  visibility: "hidden",

  top: 0,
  left: 0,

  backgroundColor: "white",
  borderColor: "gray",
  borderStyle: "solid",
  borderWidth: "0.1rem",

  minWidth: "10rem",
});

export const styleItem = style({
  margin: "0.5rem",
});

export const styleHorizon = style({
  margin: "0.2rem",
});
