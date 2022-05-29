import { render } from "solid-js/web";
import "destyle.css";

import { MusicPlayer } from "~/components/MusicPlayer";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const root = document.getElementById("root");

if (root !== null) {
  render(MusicPlayer, root);
}
