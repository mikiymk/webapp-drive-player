import { style } from "@vanilla-extract/css";

export const styleIcon = style({
  textAlign: "center",
  verticalAlign: "middle",

  selectors: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
});
