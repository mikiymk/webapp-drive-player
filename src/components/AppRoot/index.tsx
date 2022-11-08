import { createEffect, onMount } from "solid-js";

import { getLibrary } from "~/api/google/fetchLibrary";
import { getPlaylists } from "~/api/google/fetchPlaylists";
import { Controller } from "~/components/Controller";
import {
  IconDrive,
  IconLibrary,
  IconPlay,
  IconPlayList,
  IconSettings,
} from "~/components/Icon";
import { ExclusiveMenuRoot } from "~/components/PopUpMenu";
import { Menu, MenuItem } from "~/components/TabMenu";

import { DriveFiles } from "~/pages/GoogleDrive";
import { Library } from "~/pages/MusicLibrary";
import { Playing } from "~/pages/Playing";

import { Playlists } from "~/pages/Playlist";
import { Settings } from "~/pages/Settings";

import { accessToken } from "~/signals/access-token";

import { addAudios, clearAudios } from "~/signals/audios";

import { addPlaylists, clearPlaylists } from "~/signals/playlists";

import { stylePlayer, themeClass } from "./style.css";
import useMusicPlayer from "./useMusicPlayer";

import type { GoogleFile } from "~/api/google/type";

export type Files = Record<string, GoogleFile>;

/**
 * react component root.
 */
export const MusicPlayer = () => {
  const { player, status } = useMusicPlayer();

  const playWithIdList = (idList: readonly string[], index: number) => {
    player.playWithIdList(idList, index);
  };

  onMount(() => {
    const element = document.getElementById("beforeload");
    if (element) {
      document.body.removeChild(element);
    }
  });

  createEffect((isAccountUpdated) => {
    const token = accessToken();
    if (!token) {
      clearAudios();
      clearPlaylists();
      return true;
    }
    if (isAccountUpdated) {
      getLibrary(token).then((lib) => lib && addAudios(lib));
      getPlaylists(token).then((lib) => lib && addPlaylists(lib));
    }
    return false;
  }, true);

  return (
    <ExclusiveMenuRoot>
      <div class={stylePlayer + " " + themeClass}>
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
          seek={(time) => player.seek(time)}
          play={() => player.play()}
          pause={() => player.pause()}
          playNext={() => player.playToNext()}
          playPrev={() => player.playToPrev()}
          setRepeat={(repeat) => player.setRepeat(repeat)}
          setShuffle={(shuffle) => player.setShuffle(shuffle)}
        />
      </div>
    </ExclusiveMenuRoot>
  );
};
