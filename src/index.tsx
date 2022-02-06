import React from "react";
import ReactDOM from "react-dom";

import "css/style.css";

import MusicPlayer from "component/MusicPlayer";

ReactDOM.render(
  <React.StrictMode>
    <MusicPlayer />
  </React.StrictMode>,
  document.getElementById("root")
);
