import { Show } from "solid-js";

import type AudioInfo from "~/audio/AudioInfo";
import useJacket from "~/hooks/useJacket";
import NoImage from "./NoImage";
import { styleImage, stylePlaying } from "./style.css";

type Props = {
  info: AudioInfo;
};

/**
 * now playing audio info view
 */
const PlayingInfo = (props: Props) => {
  const jacket = useJacket(() => props.info.picture);

  return (
    <div class={stylePlaying}>
      <Show when={jacket()} fallback={<NoImage />}>
        {jacket => <img src={jacket} alt="album jacket" class={styleImage} />}
      </Show>
      <dl>
        <dt>Album</dt>
        <dd>{props.info.album}</dd>
        <dt>Album Artist</dt>
        <dd>{props.info.albumartist}</dd>
        <dt>Title</dt>
        <dd>{props.info.title}</dd>
        <dt>Artist</dt>
        <dd>{props.info.artists}</dd>
        <dt>Disk</dt>
        <dd>
          {props.info.disk.no}/{props.info.disk.of}
        </dd>
        <dt>Track</dt>
        <dd>
          {props.info.track.no}/{props.info.track.of}
        </dd>
      </dl>
    </div>
  );
};

export default PlayingInfo;
