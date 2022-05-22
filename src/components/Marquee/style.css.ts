import { keyframes, style } from "@vanilla-extract/css";

/** https://qiita.com/nissuk/items/7d5545a9f6177ff965dc */

/** マーキーアニメーション */
const marquee = keyframes({
  "0%": { transform: "translate(0)" },
  "100%": { transform: "translate(-100%)" },
});

export const styleMarquee = style({
  overflow: "hidden" /* スクロールバーが出ないように */,
  position: "relative" /* マーキーの内容部分の位置の基準になるように */,
  display: "inline",

  selectors: {
    /* マーキーの内容部分の高さ確保 */
    "&::after": {
      content: "",
      whiteSpace: "nowrap",
      display: "inline-block",
    },
  },
});

/** マーキーさせたい部分(内側) */
export const styleInner = style({
  position: "absolute",
  top: 0,
  left: 0,
  whiteSpace: "nowrap",
  animation: "none linear infinite 20s 2s",

  selectors: {
    [`${styleMarquee}:hover > &`]: {
      animationName: marquee,
    },
  },
  "@media": {
    "(hover: none)": {
      animationName: marquee,
    },
  },
});
