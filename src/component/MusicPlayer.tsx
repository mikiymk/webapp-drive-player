import React from "react";
import { loadAndInit, getFiles, signOut, signIn } from "../api";
import { File } from "../type";
import { PlayingList } from "../audio";
import { PlayingInfo } from "./PlayManager";
import { MusicList } from "./MusicList";
import { NowPlayingList } from "./PlayingList";

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

    this.state.audio.onTimeUpdate = () => this.forceUpdate();
  }

  /**
   * of sign in status,
   * @param isSignedIn if google signed in
   */
  updateSigninStatus(isSignedIn: boolean) {
    this.setState({ isSignedIn });
    if (isSignedIn) {
      getFiles(files =>
        this.setState(state => {
          state.files.push(...files);
          return state;
        })
      );
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
      state.audio.addMusicToPlaying(file);
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
          paused={this.state.audio.playing.isPaused}
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
          deletePlaying={index =>
            this.state.audio.deleteMusicFromPlaying(index)
          }
        />
        <pre>{this.state.preText}</pre>
      </div>
    );
  }
}

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
