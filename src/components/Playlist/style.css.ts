import { style } from "@vanilla-extract/css";

export const stylePlaylist = style({});

export const stylePlaylists = style({});

export const styleMakePlaylist = style({});

export const styleDialog = style({});

export const styleDialogInput = style({
  border: "solid black 1px",
});

export const styleDialogButton = style({
  background: "#bbb",
  margin: "0 .2rem",
  ":disabled": {
    color: "#999",
  },
});
