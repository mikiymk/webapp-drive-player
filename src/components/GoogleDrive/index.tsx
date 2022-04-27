import React from "react";

import { Breadcrumbs } from "./Breadcrumbs";

import { getAllMusics, getAllFolders, File } from "~/file";
import { styleDrive, styleItem, styleItemIcon } from "./style.css";

import Icon from "~/components/GoogleIcon";
import { useGDriveParents } from "./useGDriveParents";
import { For } from "solid-js";

type Props = {
  accessToken: string;
  addFile: (file: File) => void;
};

/**
 * get files from google drive
 */
const DriveFiles = (props: Props) => {
  const parents = useGDriveParents(
    props.accessToken,
    getAllFolders,
    getAllMusics
  );
  const { addParents, move, folders, files } = parents;

  return (
    <div className={styleDrive}>
      <Breadcrumbs parents={parents.parents()} move={move} />
      <ul className="drive-list">
        <For each={folders()}>
          {folder => (
            <ItemFolder name={folder.name} move={() => addParents(folder)} />
          )}
        </For>
        <For each={files()}>
          {file => (
            <ItemFile name={file.name} addFile={() => props.addFile(file)} />
          )}
        </For>
      </ul>
    </div>
  );
};

type PropsItemFolder = {
  name: string;
  move: () => void;
};

const ItemFolder = (props: PropsItemFolder) => {
  return (
    <li className={styleItem} onClick={props.move}>
      <Icon icon="folder" className={styleItemIcon} />
      <span>{props.name}</span>
    </li>
  );
};

type PropsItemFile = {
  name: string;
  addFile: () => void;
};

const ItemFile = (props: PropsItemFile) => {
  return (
    <li className={styleItem} onClick={props.addFile}>
      <Icon icon="audio_file" className={styleItemIcon} />
      <span>{props.name}</span>
    </li>
  );
};

export default DriveFiles;
