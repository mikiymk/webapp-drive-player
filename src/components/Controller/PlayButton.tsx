import { Show } from "solid-js";

import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
};

const PlayButton = (props: Props) => {
  return (
    <Show
      when={props.isPlaying}
      fallback={
        <IconButton
          icon={"play_arrow"}
          onClick={props.play}
          class={styleIcon}
        />
      }>
      <IconButton
        icon={"pause"}
        onClick={() => props.pause()}
        class={styleIcon}
      />
    </Show>
  );
};

export default PlayButton;
