import { style } from "@vanilla-extract/css";

import { vars } from "~/components/AppRoot/style.css";

export const stylePlaying = style({
  display: "flex",
  flexWrap: "wrap",
  height: "100%",
  width: "100%",
});

export const styleImage = style({
  flex: "0 0 min(calc(100vh - 4rem), 100%)",
  height: "min-content",
  maxHeight: "100%",
  width: "100%",
  objectFit: "contain",
});

export const styleNoImage = style({
  fill: vars.color.prim,
  font: "bold 10px sans-serif",
  textAnchor: "middle",
});

export const styleNoImageBG = style({
  fill: vars.color.primDark,
});

export const styleInfo = style({
  flex: "1 1 0",
});
