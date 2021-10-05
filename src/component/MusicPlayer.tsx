import React from "react";
import { getFiles } from "../api";
import { File } from "../type";
import PlayingInfo from "./PlayManager";
import MusicList from "./MusicList";
import PlayingList from "./PlayingList";
import Authorize from "./Authorize";
import { playWithUrl } from "../audio/player";

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
    playWithUrl(item.id);
  }

  render() {
    return (
      <div>
        <PlayingInfo
          name={""}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          paused={this.state.paused}
          seek={() => console.log("cannnot seek")}
          play={() => console.log("cannnot  play")}
          pause={() => console.log("cannnot pause")}
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
