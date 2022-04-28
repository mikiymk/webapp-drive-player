import { render } from "solid-js/web";

import "~/css/style.css";

import MusicPlayer from "~/components/MusicPlayer";

import init, { greet } from "../wasm-sql/pkg";

init().then(() => greet());

const root = document.getElementById("root");

if (root !== null) {
  try {
    render(MusicPlayer, root);
  } catch (e) {
    console.error(e);
  }
}
