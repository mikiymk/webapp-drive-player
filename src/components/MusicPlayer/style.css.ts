import { globalStyle, style } from "@vanilla-extract/css";

export const stylePlayer = style({
  display: "flex",
  flexDirection: "column",

  width: "100%",
  height: "100%",
});

globalStyle(":root, body, #root", {
  height: "100%",
  width: "100%",
});
