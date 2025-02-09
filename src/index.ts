// eslint-disable-next-line import/no-unresolved
import { registerSW } from "virtual:pwa-register";
import { render } from "solid-js/web";

import { MusicPlayer } from "~/components/AppRoot";

import "destyle.css";

registerSW({});

const root = document.getElementById("root");

if (root !== null) {
  render(MusicPlayer, root);
}
