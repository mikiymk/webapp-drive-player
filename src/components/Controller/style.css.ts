import { style } from "@vanilla-extract/css";

import { vars } from "../AppRoot/style.css";

export const controller = style({
  display: "grid",
  justifyContent: "center",
  flex: "0 0 3rem",
  fontSize: "2rem",
  backgroundColor: vars.color.prim,
  grid: "3rem / repeat(5, 1fr)",

  "@media": {
    "(min-width: 30rem)": {
      display: "flex",
    },
  },
});

export const iconButton = style({
  height: "3rem",
  width: "3rem",
  textAlign: "center",
  justifySelf: "center",
});

export const seekBar = style({
  flex: "0 0 0.5rem",
  backgroundColor: vars.color.primDark,

  selectors: {
    "&:focus, &:active": {
      outline: "none",
    },
  },
});

export const titleBox = style({
  flex: "1 0 calc(100vw - 30rem)",
  gridColumn: "1 / -1",
  gridRow: "1",

  display: "flex",
  flexDirection: "column",
});

export const title = style({
  flex: "3 1 1rem",
  fontSize: "1.5rem",
});

export const artist = style({
  flex: "2 1 1rem",
  fontSize: "0.8rem",
});

export const timeBox = style({
  display: "none",
  margin: "0.9rem 0",
  minWidth: "12ch",
  fontSize: "1rem",
  textAlign: "center",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});
