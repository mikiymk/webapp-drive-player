import { style } from "@vanilla-extract/css";

import { vars } from "~/components/AppRoot/style.css";

export const stylePlaylist = style({});

export const stylePlaylists = style({});

export const styleMakePlaylist = style({});

export const styleDialog = style({});

export const styleDialogInput = style({
  border: "solid 1px " + vars.color.text,
});

export const styleDialogButton = style({
  background: vars.color.seco,
  margin: "0 .2rem",
  ":disabled": {
    color: vars.color.secoDark,
  },
});
