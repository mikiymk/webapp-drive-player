import { render } from "solid-js/web";
import "destyle.css";

import { MusicPlayer } from "~/components/MusicPlayer";

const root = document.getElementById("root");

if (root !== null) {
  render(MusicPlayer, root);
}
