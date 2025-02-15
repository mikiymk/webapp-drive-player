import { createSignal } from "solid-js";

import { makePlButton } from "./style.css";

interface MakePlaylistButtonProps {
  makePlaylist: (playlist: string) => void;
}

/** show on right click */
export const MakePlaylistButton = (props: MakePlaylistButtonProps) => {
  const [value, setValue] = createSignal("");

  const addPlaylist = () => {
    const name = value();
    if (name === "") {
      console.log("input playlist name");
      return;
    }
    try {
      props.makePlaylist(name);
      setValue("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <span class={makePlButton}>
      <button type="button" onClick={addPlaylist}>
        add playlist
      </button>
      <input
        type="text"
        onInput={(event) => {
          setValue(event.currentTarget.value);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") addPlaylist();
        }}
      />
    </span>
  );
};
