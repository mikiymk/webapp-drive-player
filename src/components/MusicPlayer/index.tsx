import { onMount } from "solid-js";

import { Controller } from "~/components/Controller";
import { DriveFiles } from "~/components/GoogleDrive";
import {
  IconDrive,
  IconLibrary,
  IconPlay,
  IconPlayList,
  IconSettings,
} from "~/components/Icon";
import { Library } from "~/components/MusicLibrary";
import { Menu, MenuItem } from "~/components/Menu";
import { Playing } from "~/components/Playing";
import { Playlists } from "~/components/Playlist";
import { ExclusiveMenuRoot } from "~/components/PopUpMenu";
import { Settings } from "~/components/Settings";
import type { GoogleFile } from "~/file";
import useMusicPlayer from "~/hooks/useMusicPlayer";

import { stylePlayer } from "./style.css";

export type Files = {
  [name: string]: GoogleFile;
};

/**
 * react component root.
 */
export const MusicPlayer = () => {
  const { player, status } = useMusicPlayer();

  const playWithIdList = (idList: readonly string[], index: number) => {
    player?.playWithIdList(idList, index);
  };

  onMount(() => {
    const element = document.getElementById("beforeload");
    if (element) {
      document.body.removeChild(element);
    }
  });

  return (
    <ExclusiveMenuRoot>
      <div class={stylePlayer}>
        <Menu defaultKey="playing">
          <MenuItem key="playing" icon={<IconPlay />} label="Now Playing">
            <Playing info={status.info()} />
          </MenuItem>
          <MenuItem key="library" icon={<IconLibrary />} label="Library">
            <Library play={playWithIdList} />
          </MenuItem>

          <MenuItem key="playlist" icon={<IconPlayList />} label="Playlist">
            <Playlists playsList={playWithIdList} />
          </MenuItem>

          <MenuItem key="drive" icon={<IconDrive />} label="Google Drive">
            <DriveFiles />
          </MenuItem>

          <MenuItem key="settings" icon={<IconSettings />} label="Settings">
            <Settings />
          </MenuItem>
        </Menu>

        <Controller
          info={status.info()}
          duration={status.duration()}
          currentTime={status.currentTime()}
          paused={status.paused()}
          repeat={status.repeat()}
          shuffle={status.shuffle()}
          seek={time => player?.seek(time)}
          play={() => player?.play()}
          pause={() => player?.pause()}
          playNext={() => player?.playToNext()}
          playPrev={() => player?.playToPrev()}
          setRepeat={repeat => player?.setRepeat(repeat)}
          setShuffle={shuffle => player?.setShuffle(shuffle)}
        />
      </div>
    </ExclusiveMenuRoot>
  );
};
