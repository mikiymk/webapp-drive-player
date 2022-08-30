import {
  assignVars,
  createTheme,
  globalStyle,
  style,
} from "@vanilla-extract/css";

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

  color: vars.color.text,

  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(vars, {
        color: {
          prim: "#444",
          primLight: "#222",
          primDark: "#777",

          seco: "#456",
          secoLight: "#134",
          secoDark: "#789",

          text: "#FFF",
          hoverShadow: "#FFF3",
        },
      }),
    },
  },
});

globalStyle(":root, body, #root", {
  height: "100%",
  width: "100%",
});
