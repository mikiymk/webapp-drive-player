import { style } from "@vanilla-extract/css";

export const styleButton = style({
  selectors: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
});
