import PlayingInfo from "../Playing/index";
import MusicList from "../MusicLibrary/index";
import DriveFiles from "../GoogleDrive/index";
import Menu from "../Menu/index";
import Controller from "../Controller/index";

import type { GoogleFile } from "~/file";
import RightMenuProvider from "~/components/RightMenu";
import Settings from "../Settings";
import Playlists from "../Playlist";
import { stylePlayer } from "./style.css";
import useMusicPlayer from "~/hooks/useMusicPlayer";
import useSignIn from "~/hooks/useSignIn";
import type { JSXElement } from "solid-js";
import {
  IconGoogleDrive,
  IconLibrary,
  IconPlay,
  IconPlayList,
  IconSettings,
} from "../Icon";

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

  const menuItems: {
    [name: string]: { name: string; icon: JSXElement; element: JSXElement };
  } = {
    playing: {
      name: "Now Playing",
      icon: <IconPlay />,
      element: <PlayingInfo info={status.info()} />,
    },
    library: {
      name: "Library",
      icon: <IconLibrary />,
      element: <MusicList play={playWithIdList} />,
    },
    playlist: {
      name: "Playlist",
      icon: <IconPlayList />,
      element: <Playlists playsList={playWithIdList} />,
    },
    drive: {
      name: "Google Drive",
      icon: <IconGoogleDrive />,
      element: <DriveFiles accessToken={accessToken()} />,
    },
    settings: {
      name: "Settings",
      icon: <IconSettings />,
      element: <Settings accessToken={accessToken()} />,
    },
  };

  return (
    <RightMenuProvider>
      <div class={stylePlayer}>
        <Menu
          items={menuItems}
          auth={{ accessToken: accessToken(), signIn, signOut }}
        />

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
