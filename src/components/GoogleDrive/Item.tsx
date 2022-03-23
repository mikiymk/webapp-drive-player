import React from "react";
import { css } from "@linaria/core";

import Icon from "components/GoogleIcon";

import { File } from "file";

const style = css`
  font-size: 1rem;
  padding: 0 0.2rem;
  border-bottom: solid gray 1px;
  cursor: pointer;

  &-icon {
    width: 2rem;
    text-align: center;
  }
`;

type Props = {
  file: File;
  click: (file: File) => void;
  folder?: boolean;
};

export const Item: React.FC<Props> = ({ file, click, folder }) => {
  return (
    <li className={style} onClick={() => click(file)}>
      {folder ? (
        <Icon icon="folder" className={`${style}-icon`} />
      ) : (
        <Icon icon="audio_file" className={`${style}-icon`} />
      )}
      <span>{file.name}</span>
    </li>
  );
};
