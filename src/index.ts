import { render } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";

import { MusicPlayer } from "~/components/MusicPlayer";

import "destyle.css";

registerSW({});

const root = document.getElementById("root");

if (root !== null) {
  render(MusicPlayer, root);
}
