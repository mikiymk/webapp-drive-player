import { style } from "@vanilla-extract/css";

import { vars } from "~/components/AppRoot/style.css";

export const plOne = style({});

export const plAll = style({});

export const makePlButton = style({});

export const renamePlDialog = style({});

export const renamePlInput = style({
  border: `solid 1px ${vars.color.text}`,
});

export const renamePlButton = style({
  background: vars.color.seco,
  margin: "0 .2rem",
  ":disabled": {
    color: vars.color.secoDark,
  },
});
