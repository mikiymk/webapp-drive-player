import React from "react";
import { getFiles } from "../api";
import { File } from "../type";
import PlayingInfo from "./PlayManager";
import MusicList from "./MusicList";
import PlayingList from "./PlayingList";
import Authorize from "./Authorize";
import AudioPlayer from "../audio/player";

/**
 * react component root.
 */
class MusicPlayer extends React.Component<
  {},
  {
    isSignedIn: boolean;
    files: File[];
    paused: boolean;
    duration: number;
    currentTime: number;
  }
> {
  player: AudioPlayer;

  constructor(props: {}) {
    super(props);
    const files: File[] = [];
    this.state = {
      isSignedIn: false,
      files,
      paused: true,
      duration: 0,
      currentTime: 0,
    };
    this.player = new AudioPlayer();
  }

  componentDidMount() {
    this.player.onSetDuration = duration =>
      this.setState(state => ({ ...state, duration }));

    this.player.onSetPause = paused =>
      this.setState(state => ({ ...state, paused }));

    this.player.onSetCurrentTime = currentTime =>
      this.setState(state => ({ ...state, currentTime }));
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
    const item = this.state.files[index];
    if (!item) {
      console.log("no item");
      return;
    }
    this.player.playWithUrl(item.id);
  }

  render() {
    return (
      <div>
        <PlayingInfo
          name={""}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          paused={this.state.paused}
          seek={time => this.player.seek(time)}
          play={() => this.player.play()}
          pause={() => this.player.pause()}
        />
        <Authorize onSignIn={() => this.onSignIn()} />
        <MusicList
          files={this.state.files}
          play={index => this.playWithIndex(index)}
        />
        <PlayingList list={[]} playingIndex={0} />
      </div>
    );
  }
}

export default MusicPlayer;
