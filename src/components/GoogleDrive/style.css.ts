import { style } from "@vanilla-extract/css";

export const styleDrive = style({
  overflowY: "scroll",
  flex: "1 0 0",
});

export const styleItem = style({
  fontSize: "1rem",
  padding: "0 0.2rem",
  borderBottom: "solid gray 1px",
  cursor: "pointer",
});

export const styleItemIcon = style({
  width: "2rem",
  textAlign: "center",
});

export const styleBreadcrumbs = style({
  backgroundColor: "gray",
});

export const styleBread = style({
  display: "inline",
  selectors: {
    "&:hover": { cursor: "pointer" },
  },
});

export const styleLoading = style({
  display: "inline",
});
