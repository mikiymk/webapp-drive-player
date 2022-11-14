import { For, Show } from "solid-js";

import { IconAudioFile, IconFolder } from "~/components/Icon";
import { addAudios } from "~/signals/audios";

import { Breadcrumbs } from "./Breadcrumbs";
import { Loading } from "./Loading";
import { audioEntryFromFile } from "./audioEntryFromGoogleFile";
import { getAudiosFromFolder } from "./getAudiosFromFolder";
import { gDrive, item } from "./style.css";
import { useGDriveParents } from "./useGDriveParents";

/**
 * get files from google drive
 */
export const DriveFiles = () => {
  const parents = useGDriveParents();

  return (
    <div class={gDrive}>
      <Breadcrumbs parents={parents.parents()} move={parents.move} />
      <Show when={!parents.loading()} fallback={<Loading />}>
        <ul class="drive-list">
          <For each={parents.folders()}>
            {(folder) => (
              <ItemFolder
                name={folder.name}
                move={() => parents.addParents(folder)}
                addFiles={() =>
                  void getAudiosFromFolder(folder).then(addAudios)
                }
              />
            )}
          </For>
          <For each={parents.files()}>
            {(file) => (
              <ItemFile
                name={file.name}
                addFile={() => addAudios([audioEntryFromFile(file)])}
              />
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};

interface ItemFolderProps {
  name: string;
  move: () => void;
  addFiles: () => void;
}

const ItemFolder = (props: ItemFolderProps) => {
  return (
    <li class={item} onClick={() => props.move()}>
      <IconFolder />
      <span>{props.name}</span>
      <button onClick={() => props.addFiles()}>
        click to add all files in the folder
      </button>
    </li>
  );
};

interface ItemFileProps {
  name: string;
  addFile: () => void;
}

const ItemFile = (props: ItemFileProps) => {
  return (
    <li class={item} onClick={() => props.addFile()}>
      <IconAudioFile />
      <span>{props.name}</span>
    </li>
  );
};
