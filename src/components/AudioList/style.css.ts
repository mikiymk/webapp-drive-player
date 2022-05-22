import { style } from "@vanilla-extract/css";

export const sList = style({
  width: "100%",
});

export const sHead = style({
  background: "#808080",
});

export const sBody = style({
  height: "100%",
  overflowY: "scroll",
});

export const sItem = style({
  borderBottom: "solid 1px rgb(162, 162, 162)",
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
