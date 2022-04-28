import { render } from "solid-js/web";

import "~/css/style.css";

import MusicPlayer from "~/components/MusicPlayer";

import init from "sql.js";

init({
  locateFile: file =>
    "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/" + file,
});

const root = document.getElementById("root");

if (root !== null) {
  try {
    render(MusicPlayer, root);
  } catch (e) {
    console.error(e);
  }
}
