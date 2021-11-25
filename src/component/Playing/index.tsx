import React from "react";

type Props = {
  title: string;
  artist: string;
  album: string;
  jacket: string;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({ title, artist, album, jacket }) => {
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
