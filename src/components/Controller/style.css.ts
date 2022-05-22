import { style } from "@vanilla-extract/css";

export const styleController = style({
  display: "flex",
  justifyContent: "center",
  flex: "0 0 3rem",
  fontSize: "2rem",
  backgroundColor: "rgb(173,173,173)",
});

export const styleButton = style({
  height: "3rem",
  width: "3rem",
  textAlign: "center",
});

export const styleExtensionButton = style({
  height: "3rem",
  width: "3rem",
  textAlign: "center",

  "@media": {
    "(max-width: 30rem)": {
      display: "none",
    },
  },
});

export const styleSeekBar = style({
  flex: "0 0 0.5rem",
  backgroundColor: "rgb(79,81,99)",

  selectors: {
    "&:focus, &:active": {
      outline: "none",
    },
  },
});

export const styleTitleView = style({
  flex: "1 0 calc(100vw - 30rem)",

  display: "flex",
  flexDirection: "column",
});

export const styleTitle = style({
  flex: "3 1 1rem",
  fontSize: "1.5rem",
});

export const styleArtist = style({
  flex: "2 1 1rem",
  fontSize: "0.8rem",
});

export const styleTime = style({
  margin: "0.9rem 0",
  minWidth: "12ch",
  fontSize: "1rem",
  textAlign: "center",

  "@media": {
    "(max-width: 30rem)": {
      display: "none",
    },
  },
});
