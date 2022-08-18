import { IconDownload, IconUpload } from "~/components/Icon";
import { getLibrary, sendLibrary } from "~/google/fetchLibrary";
import { getPlaylists, sendPlaylists } from "~/google/fetchPlaylists";

import { accessToken } from "~/signals/access-token";
import { addAudios, audios } from "~/signals/audios";
import { addPlaylists, playlists } from "~/signals/playlists";

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

  // download

  const downloadedLibraryPromise = getLibrary(token);
  const downloadedPlaylistsPromise = getPlaylists(token);

  const [downloadedLibrary, downloadedPlaylists] = await Promise.all([
    downloadedLibraryPromise,
    downloadedPlaylistsPromise,
  ]);
  if (downloadedLibrary !== null) addAudios(downloadedLibrary);
  if (downloadedPlaylists !== null) addPlaylists(downloadedPlaylists);

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
