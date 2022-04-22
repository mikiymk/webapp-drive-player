import React, { useRef } from "react";
import { styleMakePlaylist } from "./style.css";

type Props = {
  makePlaylist: (playlist: string) => void;
};

/** show on right click */
const MakePlaylistButton: React.FC<Props> = ({ makePlaylist }) => {
  const ref = useRef<HTMLInputElement>(null);

  const addPlaylist = () => {
    const name = ref.current?.value;
    if (name === undefined || name === null || name === "") {
      console.log("input playlist name");
      return;
    }
    try {
      makePlaylist(name);
      if (ref.current !== null) {
        ref.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <span className={styleMakePlaylist}>
      <button onClick={addPlaylist}>add playlist</button>
      <input
        type="text"
        ref={ref}
        onKeyPress={event => {
          if (event.key === "Enter") addPlaylist();
        }}
      />
    </span>
  );
};

export default MakePlaylistButton;
