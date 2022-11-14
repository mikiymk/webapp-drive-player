import { createMemo } from "solid-js";

import { IconDotInfo } from "~/components/Icon";
import { usePopMenu } from "~/components/PopUpMenu";
import { formatTime } from "~/format";
import { getAudio } from "~/signals/audios";
import { getPlaylist } from "~/signals/playlists";

const calcTotalDuration = (audioList: readonly string[]): number => {
  let totalDuration = 0;
  for (const audio of audioList) {
    const { duration } = getAudio(audio) ?? { duration: 0 };
    totalDuration += duration;
  }

  return totalDuration;
};

interface PlaylistListItemProps {
  name: string;
}

export const PlaylistListItem = (props: PlaylistListItemProps) => {
  const popMenu = usePopMenu();
  const playlistDuration = createMemo(() => {
    const playlist = getPlaylist(props.name);
    if (!playlist) return 0;
    return calcTotalDuration(playlist);
  });

  return (
    <li onContextMenu={popMenu}>
      {props.name} {formatTime(playlistDuration())}
      <button onClick={popMenu}>
        <IconDotInfo />
      </button>
    </li>
  );
};
