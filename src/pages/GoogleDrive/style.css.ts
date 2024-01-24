import { style } from "@vanilla-extract/css";

import { vars } from "~/components/AppRoot/style.css";

export const gDrive = style({
  overflowY: "scroll",
  flex: "1 0 0",
});

export const item = style({
  fontSize: "1rem",
  padding: "0 0.2rem",
  borderBottom: `solid 1px ${vars.color.primDark}`,
  cursor: "pointer",
});

export const itemIcon = style({
  width: "2rem",
  textAlign: "center",
});

export const breadcrumbs = style({
  backgroundColor: vars.color.primDark,
});

export const bread = style({
  display: "inline",
  selectors: {
    "&:hover": { cursor: "pointer" },
  },
});

export const loading = style({
  display: "inline",
});
