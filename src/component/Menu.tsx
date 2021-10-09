import React from "react";

const Menu: React.FC<{}> = props => {
  return (
    <ul>
      <li>
        <a href="#playing">Now Playing</a>
      </li>
      <li>
        <a href="#song">All Songs</a>
      </li>
      <li>
        <a href="#playlist">Playlists</a>
      </li>
      <li>
        <a href="#file">Drive Files</a>
      </li>
      <li>
        <a href="#setting">Settings</a>
      </li>
    </ul>
  );
};

export default Menu;
