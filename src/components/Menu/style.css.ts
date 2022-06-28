import { style } from "@vanilla-extract/css";

export const styleNav = style({
  flex: "0 0 max-content",
  backgroundColor: "rgb(165, 165, 165)",
  textAlign: "center",
});

export const styleNavItem = style({
  display: "inline-block",
});

export const styleNavItemButton = style({
  padding: "0.5rem",
  whiteSpace: "nowrap",

  selectors: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
});

export const styleNavSelected = style({
  backgroundColor: "rgba(0, 0, 0, 0.1)",
});

export const styleContent = style({
  flex: "1 0 0",
  backgroundColor: "rgb(207, 207, 207)",
  display: "flex",
  flexDirection: "column",
});

export const styleLabel = style({
  display: "none",
  marginLeft: "0.5rem",

  "@media": {
    "(min-width: 30rem)": {
      display: "unset",
    },
  },
});
