import { sendLibrary } from "~/api/google/fetchLibrary";
import { sendPlaylists } from "~/api/google/fetchPlaylists";
import { IconDownload, IconUpload } from "~/components/Icon";

import { accessToken } from "~/signals/access-token";
import { audios } from "~/signals/audios";
import { playlists } from "~/signals/playlists";

import { Load } from "./Load";
import { styleSettings } from "./style.css";

/**
 * now playing audio info view
 */
export const Settings = () => {
  return (
    <div class={styleSettings}>
      <Load load={syncLibrary}>
        <IconUpload />
        <IconDownload />
        Sync library and playlists data with drive
      </Load>
    </div>
  );
};

const syncLibrary = async () => {
  const token = accessToken();
  if (token === undefined) throw new Error("You are not logged in");

  // upload

  const libraryResponsePromise = sendLibrary(token, Array.from(audios()));
  const playlistResponsePromise = sendPlaylists(token, Array.from(playlists()));

  const [libraryResponse, playlistResponse] = await Promise.all([
    libraryResponsePromise,
    playlistResponsePromise,
  ]);

  if (libraryResponse.status !== 200)
    throw new Error(libraryResponse.statusText);

  if (playlistResponse.status !== 200)
    throw new Error(playlistResponse.statusText);
};
