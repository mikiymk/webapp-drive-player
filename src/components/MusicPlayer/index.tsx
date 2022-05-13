import PlayingInfo from "../Playing/index";
import MusicList from "../MusicLibrary/index";
import DriveFiles from "../GoogleDrive/index";
import Controller from "../Controller/index";

import type { GoogleFile } from "~/file";
import RightMenuProvider from "~/components/RightMenu";
import Settings from "../Settings";
import Playlists from "../Playlist";
import { stylePlayer } from "./style.css";
import useMusicPlayer from "~/hooks/useMusicPlayer";
import useSignIn from "~/hooks/useSignIn";
import {
  IconDrive,
  IconLibrary,
  IconPlay,
  IconPlayList,
  IconSettings,
} from "../Icon";
import { Menu, MenuItem } from "../Menu";

export type Files = {
  [name: string]: GoogleFile;
};

/**
 * react component root.
 */
const MusicPlayer = () => {
  const { accessToken, signIn, signOut } = useSignIn();
  const { player, status } = useMusicPlayer(accessToken);

  const playWithIdList = (idList: string[], index: number) => {
    player?.playWithIdList(idList, index);
  };

  return (
    <RightMenuProvider>
      <div class={stylePlayer}>
        <Menu
          defaultKey="playing"
          auth={{ accessToken: accessToken(), signIn, signOut }}>
          <MenuItem key="playing" icon={<IconPlay />} label="Now Playing">
            <PlayingInfo info={status.info()} />
          </MenuItem>
          <MenuItem key="library" icon={<IconLibrary />} label="Library">
            <MusicList play={playWithIdList} />
          </MenuItem>

          <MenuItem key="playlist" icon={<IconPlayList />} label="Playlist">
            <Playlists playsList={playWithIdList} />
          </MenuItem>

          <MenuItem key="drive" icon={<IconDrive />} label="Google Drive">
            <DriveFiles accessToken={accessToken()} />
          </MenuItem>

          <MenuItem key="settings" icon={<IconSettings />} label="Settings">
            <Settings accessToken={accessToken()} />
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
    </RightMenuProvider>
  );
};

export default MusicPlayer;
