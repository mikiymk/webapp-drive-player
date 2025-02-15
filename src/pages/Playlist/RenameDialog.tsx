import { createEffect, createSignal } from "solid-js";

import { playlists } from "~/signals/playlists";

import { renamePlButton, renamePlDialog, renamePlInput } from "./style.css";

interface RenameDialogProps {
  name: string | undefined;
  close: (data?: string) => void;
}

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
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    if (event.key === "Enter") {
      handleChange(event);
      if (!error()) {
        props.close(newName());
      }
    }
  };

  return (
    <dialog class={renamePlDialog} open>
      <label>
        playlist name
        <input
          class={renamePlInput}
          value={newName()}
          onChange={handleChange}
          onKeyPress={handleKey}
        />
      </label>
      <p>{error()}</p>
      <button
        type="button"
        class={renamePlButton}
        onClick={() => {
          props.close();
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        class={renamePlButton}
        onClick={() => {
          props.close(newName());
        }}
        disabled={Boolean(error())}
      >
        Rename
      </button>
    </dialog>
  );
};
