import { createSignal, onMount } from "solid-js";

import { playlists } from "~/hooks/createPlaylists";

export type RenameDialogProps = {
  name: string | undefined;
  close: (data?: string) => void;
};

/** show on right click */
export const RenameDialog = (props: RenameDialogProps) => {
  const [newName, setNewName] = createSignal("");
  const [error, setError] = createSignal("");
  onMount(() => {
    if (props.name) setNewName(props.name);
  });

  const handleChange = (event: { currentTarget: HTMLInputElement }) => {
    const newName = event.currentTarget.value;
    if (playlists().has(newName)) setError("duplicate name");
    else setError("");
    setNewName(newName);
  };

  return (
    <dialog open>
      <p>rename playlist</p>
      <input value={newName()} onchange={handleChange} />
      <p>{error()}</p>
      <button onclick={() => props.close()}>Cancel</button>
      <button onclick={() => props.close(newName())}>Confirm</button>
    </dialog>
  );
};
