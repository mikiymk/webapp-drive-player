import React from "react";
import { loadAndInit, getFiles, signOut, signIn } from "./api";
import { File, PropPlay } from "./type";
import { formatTime } from "./format";
import { PlayingList } from "./audio";

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<
  {},
  {
    isSignedIn: boolean;
    files: File[];
    preText: string;
    audio: PlayingList;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isSignedIn: false,
      files: [],
      preText: "",
      audio: new PlayingList(),
    };
  }

  componentDidMount() {
    loadAndInit(
      isSignedIn => this.updateSigninStatus(isSignedIn),
      error => this.appendPre(JSON.stringify(error, null, 2))
    );

    this.state.audio.onTimeUpdate(() => this.forceUpdate());
  }

  /**
   * of sign in status,
   * @param isSignedIn if google signed in
   */
  updateSigninStatus(isSignedIn: boolean) {
    this.setState({ isSignedIn });
    if (isSignedIn) {
      getFiles().then(files => this.setState({ files }));
    }
  }

  /**
   * message append to pre element
   * @param message append message
   */
  appendPre(message: string) {
    const preText = this.state.preText + message + "\n";
    this.setState({ preText });
  }

  playTo(move: number) {
    this.setState(state => {
      state.audio.skipTo(move);
      state.audio.play();
      return state;
    });
  }

  addToPlayingList(file: File) {
    this.setState(state => {
      state.audio.addMusic(file);
      return state;
    });
  }

  setPlaying(isPlay: boolean) {
    this.setState(state => {
      if (isPlay) {
        state.audio.play();
      } else {
        state.audio.pause();
      }
      return state;
    });
  }

  seek(time: number) {
    this.setState(state => {
      state.audio.seek(time);
      return state;
    });
  }

  render() {
    return (
      <div>
        <PlayingInfo
          name={""}
          duration={this.state.audio.playing.duration}
          currentTime={this.state.audio.playing.currentTime}
          paused={this.state.audio.playing.paused}
          seek={time => this.seek(time)}
          play={() => this.setPlaying(true)}
          pause={() => this.setPlaying(false)}
        />
        <AuthButton isSignedIn={this.state.isSignedIn} />
        <MusicList
          files={this.state.files}
          play={file => this.addToPlayingList(file)}
        />
        <NowPlayingList
          list={this.state.audio.list}
          playingIndex={this.state.audio.index}
        />
        <pre>{this.state.preText}</pre>
      </div>
    );
  }
}

/**
 * now playing audio info view
 * @param props compontnt props
 * @param props.name play song name
 * @param props.audio play song audio element
 * @returns react render
 */
const PlayingInfo: React.FC<{
  name: string;
  duration: number;
  currentTime: number;
  paused: boolean;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
}> = ({ name, duration, currentTime, paused, seek, play, pause }) => {
  const durationText = formatTime(duration || 0);
  const currentTimeText = formatTime(currentTime || 0);

  return (
    <div>
      {name}
      <PlayPauseButton isPaused={paused} play={play} pause={pause} />
      <SeekBar duration={duration} time={currentTime} seek={seek} />
      {currentTimeText}/{durationText}
    </div>
  );
};

const PlayPauseButton: React.FC<{
  isPaused: boolean;
  play: () => void;
  pause: () => void;
}> = ({ isPaused, play, pause }) => {
  if (isPaused) {
    return <button onClick={play}>play</button>;
  } else {
    return <button onClick={pause}>pause</button>;
  }
};

const SeekBar: React.FC<{
  duration: number;
  time: number;
  seek: (time: number) => void;
}> = ({ duration, time, seek }) => {
  duration ||= 0;
  time ||= 0;

  return (
    <input
      type="range"
      min="0"
      max={duration * 1000}
      value={time * 1000}
      onChange={event => seek(parseInt(event.target.value, 10) / 1000)}></input>
  );
};

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const AuthButton: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) => {
  if (isSignedIn) {
    return <button onClick={signOut}>Sign Out</button>;
  } else {
    return <button onClick={signIn}>Authorize</button>;
  }
};

/**
 * list of musics
 * @param props compontnt props
 * @returns react render
 */
const MusicList: React.FC<{ files: File[] } & PropPlay> = ({ files, play }) => {
  const listitems = files.map(file => (
    <MusicListItem key={file.id} {...file} play={play} />
  ));
  return (
    <div>
      Files:
      <ul>{listitems}</ul>
    </div>
  );
};

/**
 * item of musics list
 * @param props compontnt props
 * @returns react render
 */
const MusicListItem: React.FC<File & PropPlay> = ({ play, name, id, link }) => {
  const playing = () => {
    play({ name, id, link });
  };
  return (
    <li>
      {name}({id})<button onClick={playing}>play</button>
    </li>
  );
};

const NowPlayingList: React.FC<{ list: File[]; playingIndex: number }> = ({
  list,
  playingIndex,
}) => {
  const listItem = list.map((item, index) => (
    <NowPlayingItem
      key={index}
      {...item}
      isPlayingNow={playingIndex === index}
    />
  ));
  return (
    <div>
      Now Playing:
      <ul>{listItem}</ul>
    </div>
  );
};

const NowPlayingItem: React.FC<File & { isPlayingNow: boolean }> = ({
  isPlayingNow,
  name,
}) => {
  return (
    <li>
      {isPlayingNow ? "playing" : ""}:{name}
    </li>
  );
};
