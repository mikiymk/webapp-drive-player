import { css } from "@linaria/core";

export const style = css`
  overflow-y: scroll;
  height: 100%;
`;

export const styleItem = css`
  font-size: 1rem;
  padding: 0 0.2rem;
  border-bottom: solid gray 1px;
  cursor: pointer;
`;

export const styleItemIcon = css`
  width: 2rem;
  text-align: center;
`;

export const styleBreadcrumbs = css`
  background-color: gray;
`;

export const styleBread = css`
  display: inline;

  &:hover {
    cursor: pointer;
  }
`;
