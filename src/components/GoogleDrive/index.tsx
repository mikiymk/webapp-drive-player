import { Breadcrumbs } from "./Breadcrumbs";

import { getAllMusics, getAllFolders, File } from "~/file";
import { styleDrive, styleItem } from "./style.css";

import { useGDriveParents } from "./useGDriveParents";
import { For } from "solid-js";
import { IconAudioFile, IconFolder } from "../Icon";

type Props = {
  accessToken: string;
  addFile: (file: File[]) => void;
};

/**
 * get files from google drive
 */
const DriveFiles = (props: Props) => {
  const parents = useGDriveParents(
    () => props.accessToken,
    getAllFolders,
    getAllMusics
  );
  const { addParents, move, folders, files } = parents;

  return (
    <div class={styleDrive}>
      <Breadcrumbs parents={parents.parents()} move={move} />
      <ul class="drive-list">
        <For each={folders()}>
          {folder => (
            <ItemFolder name={folder.name} move={() => addParents(folder)} />
          )}
        </For>
        <For each={files()}>
          {file => (
            <ItemFile name={file.name} addFile={() => props.addFile([file])} />
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
    <li class={styleItem} onClick={() => props.move()}>
      <IconFolder />
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
    <li class={styleItem} onClick={() => props.addFile()}>
      <IconAudioFile />
      <span>{props.name}</span>
    </li>
  );
};

export default DriveFiles;
