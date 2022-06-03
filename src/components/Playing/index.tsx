import { Show } from "solid-js";

import useJacket from "~/hooks/useJacket";

import { NoImage } from "./NoImage";
import { styleImage, styleInfo, stylePlaying } from "./style.css";

import type { AudioInfo } from "~/audio/AudioInfo";

export type PlayingProps = {
  info: AudioInfo;
};

/**
 * now playing audio info view
 */
export const Playing = (props: PlayingProps) => {
  const jacket = useJacket(() => props.info.picture);

  return (
    <div class={stylePlaying}>
      <Show when={jacket()} fallback={<NoImage />}>
        {jacket => <img src={jacket} alt="album jacket" class={styleImage} />}
      </Show>
      <dl class={styleInfo}>
        <dt>Album</dt>
        <dd>{props.info.album}</dd>
        <dt>Album Artist</dt>
        <dd>{props.info.albumartist}</dd>
        <dt>Title</dt>
        <dd>{props.info.title}</dd>
        <dt>Artist</dt>
        <dd>{props.info.artists.join()}</dd>
        <dt>Disk</dt>
        <dd>
          {props.info.disk.no}
          <Show when={props.info.disk.of}>{of => <>/ {of}</>}</Show>
        </dd>
        <dt>Track</dt>
        <dd>
          {props.info.track.no}
          <Show when={props.info.track.of}>{of => <>/ {of}</>}</Show>
        </dd>
      </dl>
    </div>
  );
};
