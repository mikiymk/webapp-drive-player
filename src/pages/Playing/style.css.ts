import { style } from "@vanilla-extract/css";

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
  fill: "#333",
  font: "bold 10px sans-serif",
  textAnchor: "middle",
});

export const styleNoImageBG = style({
  fill: "#888",
});

export const styleInfo = style({
  flex: "1 1 0",
});
