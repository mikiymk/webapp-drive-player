import React from "react";

import { Breadcrumbs } from "./Breadcrumbs";

import { getAllMusics, getAllFolders, File } from "~/file";
import { styleDrive, styleItem, styleItemIcon } from "./style.css";

import Icon from "~/components/GoogleIcon";
import { useGDriveParents } from "./useGDriveParents";

type Props = {
  accessToken: string;
  addFile: (file: File) => void;
};

/**
 * get files from google drive
 */
const DriveFiles: React.FC<Props> = ({ accessToken, addFile }) => {
  const parents = useGDriveParents(accessToken, getAllFolders, getAllMusics);
  const { addParents, move, folders, files } = parents;

  return (
    <div className={styleDrive}>
      <Breadcrumbs parents={parents.parents} move={move} />
      <ul className="drive-list">
        {folders.map(file => (
          <ItemFolder
            key={file.id}
            name={file.name}
            move={() => addParents(file)}
          />
        ))}
        {files.map(file => (
          <ItemFile
            key={file.id}
            name={file.name}
            addFile={() => addFile(file)}
          />
        ))}
      </ul>
    </div>
  );
};

type PropsItemFolder = {
  name: string;
  move: () => void;
};

const ItemFolder: React.FC<PropsItemFolder> = ({ name, move }) => {
  return (
    <li className={styleItem} onClick={move}>
      <Icon icon="folder" className={styleItemIcon} />
      <span>{name}</span>
    </li>
  );
};

type PropsItemFile = {
  name: string;
  addFile: () => void;
};

const ItemFile: React.FC<PropsItemFile> = ({ name, addFile }) => {
  return (
    <li className={styleItem} onClick={addFile}>
      <Icon icon="audio_file" className={styleItemIcon} />
      <span>{name}</span>
    </li>
  );
};

export default DriveFiles;
