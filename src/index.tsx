import { render } from "solid-js/web";

import "~/css/style.css";

import MusicPlayer from "~/components/MusicPlayer";

const root = document.getElementById("root");

if (root !== null) {
  try {
    render(MusicPlayer, root);
  } catch (e) {
    console.error(e);
  }
}
