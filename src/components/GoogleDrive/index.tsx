import { For, Show } from "solid-js";

import { namedInfo } from "~/audio/AudioInfo";
import { IconAudioFile, IconFolder } from "~/components/Icon";
import { addAudios } from "~/hooks/createAudios";

import { Breadcrumbs } from "./Breadcrumbs";
import { Loading } from "./Loading";
import { styleDrive, styleItem } from "./style.css";
import { useGDriveParents } from "./useGDriveParents";

/**
 * get files from google drive
 */
export const DriveFiles = () => {
  const parents = useGDriveParents();
  const addAudioFile = (id: string, name: string) => {
    addAudios([[id, namedInfo(name)]]);
  };

  return (
    <div class={styleDrive}>
      <Breadcrumbs parents={parents.parents()} move={parents.move} />
      <Show when={!parents.loading()} fallback={<Loading />}>
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
