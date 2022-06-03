import { createEffect, createSignal } from "solid-js";

import { playlists } from "~/hooks/createPlaylists";

import { styleDialog, styleDialogButton, styleDialogInput } from "./style.css";

export type RenameDialogProps = {
  name: string | undefined;
  close: (data?: string) => void;
};

/** show on right click */
export const RenameDialog = (props: RenameDialogProps) => {
  const [newName, setNewName] = createSignal("");
  const [error, setError] = createSignal("");
  createEffect(() => {
    if (props.name) setNewName(props.name);
    else setNewName("");
  });

  const handleChange = (event: { currentTarget: HTMLInputElement }) => {
    const newName = event.currentTarget.value;
    if (playlists().has(newName)) setError("duplicate name");
    else if (newName === "") setError("empty name");
    else setError("");
    setNewName(newName);
  };

  const handleKey = (
    event: KeyboardEvent & { currentTarget: HTMLInputElement }
  ) => {
    if (event.key === "Enter") {
      handleChange(event);
      if (!error()) {
        props.close(newName());
      }
    }
  };

  return (
    <dialog class={styleDialog} open>
      <label>
        playlist name
        <input
          class={styleDialogInput}
          value={newName()}
          onchange={handleChange}
          onkeypress={handleKey}
        />
      </label>
      <p>{error()}</p>
      <button class={styleDialogButton} onclick={() => props.close()}>
        Cancel
      </button>
      <button
        class={styleDialogButton}
        onclick={() => props.close(newName())}
        disabled={Boolean(error())}>
        Rename
      </button>
    </dialog>
  );
};
