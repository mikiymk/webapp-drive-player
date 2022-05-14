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
  flex: "0 1 100vh",
  backgroundColor: "rgb(207, 207, 207)",
  overflow: "hidden",
});

export const styleLabel = style({
  marginLeft: "0.5rem",
});
