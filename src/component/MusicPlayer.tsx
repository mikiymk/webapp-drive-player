import React from "react";
import { loadAndInit, getFiles, signOut, signIn } from "../api";
import { File } from "../type";
import { PlayingInfo } from "./PlayManager";
import { MusicList } from "./MusicList";
import { NowPlayingList } from "./PlayingList";
import { AudioPlayer } from "../player";
import { AudioList } from "../list";

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<
  {},
  {
    isSignedIn: boolean;
    files: File[];
    preText: string;
    context: AudioContext;
    player: AudioPlayer;
    list: AudioList;
    paused: boolean;
    duration: number;
    currentTime: number;
  }
> {
  constructor(props: {}) {
    super(props);
    const ctx = new AudioContext();
    const file: File[] = [];
    this.state = {
      isSignedIn: false,
      files: file,
      preText: "",
      context: ctx,
      player: new AudioPlayer(ctx),
      list: new AudioList(ctx, file, 0),
      paused: true,
      duration: 0,
      currentTime: 0,
    };
  }

  componentDidMount() {
    loadAndInit(
      isSignedIn => this.updateSigninStatus(isSignedIn),
      error => this.appendPre(JSON.stringify(error, null, 2))
    );

    this.state.player.onSetCurrentTime = currentTime =>
      this.setState(state => {
        const newState = {
          ...state,
        };
        newState.currentTime = currentTime;
        return state;
      });

    this.state.player.onSetDuration = duration =>
      this.setState(state => {
        const newState = {
          ...state,
        };
        newState.duration = duration;
        return state;
      });

    this.state.player.onSetPause = paused =>
      this.setState(state => {
        const newState = {
          ...state,
        };
        newState.paused = paused;
        return state;
      });

    this.state.list.getBuffer(buffer => this.state.player.setBuffer(buffer));
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

  playWithIndex(index: number) {
    this.setState(state => {
      state.list.setIndex(index);
      return state;
    });
  }

  setPlaying(isPlay: boolean) {
    if (isPlay) {
      this.state.player.play();
    } else {
      this.state.player.pause();
    }
  }

  seek(time: number) {
    this.state.player.seek(time);
  }

  render() {
    return (
      <div>
        <PlayingInfo
          name={""}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          paused={this.state.paused}
          seek={time => this.seek(time)}
          play={() => this.setPlaying(true)}
          pause={() => this.setPlaying(false)}
        />
        <AuthButton isSignedIn={this.state.isSignedIn} />
        <MusicList
          files={this.state.files}
          play={index => this.playWithIndex(index)}
        />
        <NowPlayingList
          list={this.state.list.list}
          playingIndex={this.state.list.index}
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
