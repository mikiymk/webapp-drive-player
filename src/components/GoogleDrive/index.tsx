import { For } from "solid-js";

import { AudioInfo } from "~/audio/AudioInfo";
import { IconAudioFile, IconFolder } from "~/components/Icon";
import { getAllMusics, getAllFolders } from "~/file";
import { useAudios } from "~/hooks/createFiles";

import { Breadcrumbs } from "./Breadcrumbs";
import { useGDriveParents } from "./useGDriveParents";
import { styleDrive, styleItem } from "./style.css";

export type DriveFilesProps = {
  accessToken: string;
};

/**
 * get files from google drive
 */
export const DriveFiles = (props: DriveFilesProps) => {
  const parents = useGDriveParents(
    () => props.accessToken,
    getAllFolders,
    getAllMusics
  );
  const { addParents, move, folders, files } = parents;
  const audios = useAudios();
  const addAudioFile = (id: string, name: string) => {
    audios.addAudios({
      [id]: AudioInfo.getNamedInfo(name),
    });
  };

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
            <ItemFile
              name={file.name}
              addFile={() => addAudioFile(file.id, file.name)}
            />
          )}
        </For>
      </ul>
    </div>
  );
};

type ItemFolderProps = {
  name: string;
  move: () => void;
};

const ItemFolder = (props: ItemFolderProps) => {
  return (
    <li class={styleItem} onClick={() => props.move()}>
      <IconFolder />
      <span>{props.name}</span>
    </li>
  );
};

type ItemFileProps = {
  name: string;
  addFile: () => void;
};

const ItemFile = (props: ItemFileProps) => {
  return (
    <li class={styleItem} onClick={() => props.addFile()}>
      <IconAudioFile />
      <span>{props.name}</span>
    </li>
  );
};
