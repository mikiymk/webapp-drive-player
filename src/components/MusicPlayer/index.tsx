import PlayingInfo from "../Playing/index";
import MusicList from "../MusicLibrary/index";
import DriveFiles from "../GoogleDrive/index";
import Menu from "../Menu/index";
import Controller from "../Controller/index";

import type { File } from "~/file";
import RightMenuContext from "~/components/RightMenu/Context";
import useRightMenuContext from "~/hooks/useRightMenuContext";
import Settings from "../Settings";
import Playlists from "../Playlist";
import usePlaylist from "~/hooks/usePlaylist";
import { stylePlayer } from "./style.css";
import useMusicPlayer from "~/hooks/useMusicPlayer";
import useSignIn from "~/hooks/useSignIn";
import type { JSX } from "solid-js";
import createLibrary from "./createLibrary";
import createFiles from "./createFiles";

export type Files = {
  [name: string]: File;
};

/**
 * react component root.
 */
const MusicPlayer = () => {
  const { accessToken, signIn, signOut } = useSignIn();
  const { select, update } = createLibrary();
  const { files, addFiles } = createFiles(select, update);
  const { player, status } = useMusicPlayer(accessToken, select, update);
  const playlist = usePlaylist();

  const playWithIdList = (idList: string[], index: number) => {
    player?.playWithIdList(idList, index);
  };

  const menuItems: {
    [name: string]: { name: string; icon: string; element: JSX.Element };
  } = {
    playing: {
      name: "Now Playing",
      icon: "play_arrow",
      element: (
        <PlayingInfo
          info={status.info()}
          files={files()}
          playingList={player?.musicIds ?? []}
        />
      ),
    },
    library: {
      name: "Library",
      icon: "list",
      element: (
        <MusicList
          files={files()}
          play={playWithIdList}
          playlist={playlist.playlists()}
          addToPlaylist={playlist.addToPlaylist}
        />
      ),
    },
    playlist: {
      name: "Playlist",
      icon: "queue_music",
      element: (
        <Playlists
          files={files()}
          playlist={{
            playlists: playlist.playlists(),
            makePlaylist: playlist.makePlaylist,
            deletePlaylist: playlist.deletePlaylist,
            addToPlaylist: playlist.addToPlaylist,
            removeFromPlaylist: playlist.removeFromPlaylist,
          }}
          playsList={playWithIdList}
        />
      ),
    },
    drive: {
      name: "Google Drive",
      icon: "cloud",
      element: <DriveFiles addFile={addFiles} accessToken={accessToken()} />,
    },
    settings: {
      name: "Settings",
      icon: "settings",
      element: (
        <Settings
          files={Object.values(files())}
          addFiles={addFiles}
          accessToken={accessToken()}
        />
      ),
    },
  };

  const { value, RightMenu } = useRightMenuContext();

  return (
    <RightMenuContext.Provider value={value.setRightMenu}>
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
        {RightMenu}
      </div>
    </RightMenuContext.Provider>
  );
};

export default MusicPlayer;
