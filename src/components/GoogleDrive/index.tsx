import { For, Show } from "solid-js";

import { AudioInfo } from "~/audio/AudioInfo";
import { IconAudioFile, IconFolder } from "~/components/Icon";
import { useAudios } from "~/hooks/createFiles";

import { Breadcrumbs } from "./Breadcrumbs";
import { Loading } from "./Loading";
import { useGDriveParents } from "./useGDriveParents";
import { styleDrive, styleItem } from "./style.css";

export type DriveFilesProps = {
  accessToken: string | undefined;
};

/**
 * get files from google drive
 */
export const DriveFiles = (props: DriveFilesProps) => {
  const parents = useGDriveParents(() => props.accessToken);
  const audios = useAudios();
  const addAudioFile = (id: string, name: string) => {
    audios.addAudios({
      [id]: AudioInfo.getNamedInfo(name),
    });
  };

  return (
    <div class={styleDrive}>
      <Breadcrumbs parents={parents.parents()} move={parents.move} />
      <Show
        when={!parents.folders.loading && !parents.files.loading}
        fallback={<Loading />}>
        <ul class="drive-list">
          <For each={parents.folders()}>
            {folder => (
              <ItemFolder
                name={folder.name}
                move={() => parents.addParents(folder)}
              />
            )}
          </For>
          <For each={parents.files()}>
            {file => (
              <ItemFile
                name={file.name}
                addFile={() => addAudioFile(file.id, file.name)}
              />
            )}
          </For>
        </ul>
      </Show>
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
