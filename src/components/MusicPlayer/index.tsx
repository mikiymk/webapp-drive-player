import React, { useState } from "react";

import PlayingInfo from "../Playing/index";
import MusicList from "../MusicLibrary/index";
import DriveFiles from "../GoogleDrive/index";
import Menu from "../Menu/index";
import Controller from "../Controller/index";

import { File } from "file";
import RightMenuContext from "components/RightMenu/Context";
import useRightMenuContext from "hooks/useRightMenuContext";
import Settings from "../Settings";
import Playlists from "../Playlist";
import usePlaylist from "hooks/usePlaylist";
import { style } from "./style";
import useMusicPlayer from "hooks/useMusicPlayer";

export type Files = {
  [name: string]: File;
};

/**
 * react component root.
 */
const MusicPlayer: React.FC = () => {
  const [signIn, setSignIn] = useState(false);
  const { files, addFile, addFiles, player, status } = useMusicPlayer();
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
          info={status.info}
          files={files}
          playingList={player?.musicIds ?? []}
        />
      ),
    },
    library: {
      name: "Library",
      icon: "list",
      element: (
        <MusicList
          files={files}
          play={playWithIdList}
          playlist={playlist.playlists}
          addToPlaylist={playlist.addToPlaylist}
        />
      ),
    },
    playlist: {
      name: "Playlist",
      icon: "queue_music",
      element: (
        <Playlists
          files={files}
          playlist={playlist}
          playsList={playWithIdList}
        />
      ),
    },
    drive: {
      name: "Google Drive",
      icon: "cloud",
      element: <DriveFiles signIn={signIn} addFile={addFile} />,
    },
    settings: {
      name: "Settings",
      icon: "settings",
      element: <Settings files={Object.values(files)} addFiles={addFiles} />,
    },
  };

  const { value, RightMenu } = useRightMenuContext();

  return (
    <RightMenuContext.Provider value={value.setRightMenu}>
      <div className={style}>
        <Menu items={menuItems} signIn={signIn} setSignIn={setSignIn} />
        <Controller
          info={status.info}
          duration={status.duration}
          currentTime={status.currentTime}
          paused={status.paused}
          repeat={status.repeat}
          shuffle={status.shuffle}
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
