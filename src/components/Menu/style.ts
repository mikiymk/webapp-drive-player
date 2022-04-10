import { css } from "@linaria/core";

export const style = css`
  display: flex;
  flex: 0 1 100vh;
  overflow: hidden;
`;

export const styleNav = css`
  flex: 0 0 max-content;
  padding-top: 4rem;
  background-color: rgb(165, 165, 165);
`;

export const styleNavItem = css`
  cursor: pointer;
  margin: 0.3rem 0rem;
  padding: 0.2rem 0.5rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const styleNavSelected = css`
  background-color: rgba(0, 0, 0, 0.1);
`;

export const styleContent = css`
  flex: 1 1 content;

  background-color: rgb(207, 207, 207);

  overflow-wrap: anywhere;
`;
