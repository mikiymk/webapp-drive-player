import { style } from "@vanilla-extract/css";

import { vars } from "~/components/AppRoot/style.css";

export const playing = style({
  display: "flex",
  flexWrap: "wrap",
  height: "100%",
  width: "100%",
});

export const image = style({
  flex: "0 0 min(calc(100vh - 4rem), 100%)",
  height: "min-content",
  maxHeight: "100%",
  width: "100%",
  objectFit: "contain",
});

export const noImage = style({
  fill: vars.color.secoDark,
  font: "bold 10px sans-serif",
  textAnchor: "middle",
});

export const noImageBG = style({
  fill: vars.color.seco,
});

export const info = style({
  flex: "1 1 0",
});
