import React from "react";

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<{
  title: string;
  artist: string;
  album: string;
  jacket: string;
}> = ({ title, artist, album, jacket }) => {
  return (
    <div>
      <p>TITLE: {title}</p>
      <p>ARTIST: {artist}</p>
      <p>ALBUM: {album}</p>
      <img src={jacket} alt="album jacket" />
    </div>
  );
};

export default PlayingInfo;
