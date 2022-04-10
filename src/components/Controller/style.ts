import { css } from "@linaria/core";

export const style = css`
  display: flex;
  justify-content: center;

  flex: 0 0 1.5rem;

  font-size: 2rem;
  background-color: rgb(173, 173, 173);
`;

export const styleIcon = css`
  height: 3rem;
  width: 3rem;
`;

export const styleSeekBar = css`
  flex: 0 0 0.5rem;

  background-color: rgb(79, 81, 99);

  &:focus,
  &:active {
    outline: none;
  }
`;

export const styleTitleView = css`
  flex: 1 0 calc(100vw - 30rem);

  display: flex;
  flex-direction: column;
`;

export const styleTitle = css`
  flex: 3 1 1rem;
  font-size: 1.5rem;
`;

export const styleArtist = css`
  flex: 2 1 1rem;
  font-size: 0.8rem;
`;

export const styleTime = css`
  margin: 0.9rem 0;
  width: 18ch;
  font-size: 1rem;
  text-align: center;
`;
