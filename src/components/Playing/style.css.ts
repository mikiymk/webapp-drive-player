import { style } from "@vanilla-extract/css";

export const stylePlaying = style({
  display: "flex",
  height: "100%",
});

export const styleImage = style({
  height: "auto",
  maxHeight: "100%",
  width: "100%",
  objectFit: "contain",
});

export const styleNoImage = style({
  backgroundColor: "#888",
  fill: "#333",
  font: "bold 1px sans-serif",
  textAnchor: "middle",
});
