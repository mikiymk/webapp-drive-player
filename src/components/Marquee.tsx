import React from "react";
import { css } from "@linaria/core";

/** https://qiita.com/nissuk/items/7d5545a9f6177ff965dc */
const style = css`
  overflow: hidden; /* スクロールバーが出ないように */
  position: relative; /* マーキーの内容部分の位置の基準になるように */
  display: inline;

  /* マーキーの内容部分の高さ確保 */
  &::after {
    content: "";
    white-space: nowrap;
    display: inline-block;
  }

  /* マーキーさせたい部分(内側) */
  &-inner {
    position: absolute;
    top: 0;
    left: 0;
    white-space: nowrap;
    animation-name: none;
  }

  /* ホバー時にアニメーション */
  &:hover > &-inner {
    animation-name: common-marquee;
    animation-timing-function: linear;
    animation-duration: 20s;
    animation-iteration-count: infinite;
  }

  /** マーキーアニメーション */
  @keyframes common-marquee {
    0% {
      transform: translate(0);
    }
    10% {
      transform: translate(0);
    }
    100% {
      transform: translate(-100%);
    }
  }
`;

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** CSSで横に動く */
const Marquee: React.FC<Props> = ({ children, className }) => {
  let classes = `${style}`;
  if (className !== undefined) {
    classes = `${style} ${className}`;
  }

  return (
    <span className={classes}>
      <span className={`${style}-inner`}>{children}</span>
    </span>
  );
};

export default Marquee;
