import { style } from "@vanilla-extract/css";

export const sList = style({
  width: "100%",
});

export const sHead = style({
  background: "#808080",
});

export const sItem = style({
  borderBottom: "solid 1px rgb(162, 162, 162)",
});

export const sItemArtist = style({
  "@media": {
    "(max-width: 700px)": {
      display: "none",
    },
  },
});

export const sDot = style({
  width: "1rem",
});
