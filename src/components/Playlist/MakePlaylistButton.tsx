import { styleMakePlaylist } from "./style.css";

type Props = {
  makePlaylist: (playlist: string) => void;
};

/** show on right click */
const MakePlaylistButton = (props: Props) => {
  let ref: HTMLInputElement | undefined = undefined;

  const addPlaylist = () => {
    const name = ref?.value;
    if (name === undefined || name === null || name === "") {
      console.log("input playlist name");
      return;
    }
    try {
      props.makePlaylist(name);
      if (ref !== undefined) {
        ref.value = "";
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
