import React from "react";
import { getFiles } from "../api";
import { File } from "../type";
import { PlayingInfo } from "./PlayManager";
import { MusicList } from "./MusicList";
import { NowPlayingList } from "./PlayingList";
import { AudioPlayer } from "../player";
import { AudioList } from "../list";
import { Authorize } from "./Authorize";

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<
  {},
  {
    isSignedIn: boolean;
    files: File[];
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
      context: ctx,
      player: new AudioPlayer(ctx),
      list: new AudioList(ctx, file, 0),
      paused: true,
      duration: 0,
      currentTime: 0,
    };
  }

  componentDidMount() {
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
   * called when sign in at google
   */
  onSignIn() {
    getFiles(files =>
      this.setState(state => {
        state.files.push(...files);
        return state;
      })
    );
  }

  playWithIndex(index: number) {
    this.setState(state => {
      state.list.setIndex(index);
      return state;
    });
  }

  render() {
    return (
      <div>
        <PlayingInfo
          name={""}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          paused={this.state.paused}
          seek={time => this.state.player.seek(time)}
          play={() => this.state.player.play()}
          pause={() => this.state.player.pause()}
        />
        <Authorize onSignIn={() => this.onSignIn()} />
        <MusicList
          files={this.state.files}
          play={index => this.playWithIndex(index)}
        />
        <NowPlayingList
          list={this.state.list.list}
          playingIndex={this.state.list.index}
        />
      </div>
    );
  }
}
