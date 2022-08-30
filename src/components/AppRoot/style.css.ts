import { createTheme, globalStyle, style } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  color: {
    prim: "#AAA",
    primLight: "#DDD",
    primDark: "#777",

    seco: "#678",
    secoLight: "#9BC",
    secoDark: "#356",

    text: "#000",
    hoverShadow: "#0003",
  },
});

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
