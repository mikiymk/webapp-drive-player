import { IconDownload, IconUpload } from "~/components/Icon";
import { getLibrary, sendLibrary } from "~/google/fetchLibrary";
import { getPlaylists, sendPlaylists } from "~/google/fetchPlaylists";
import { addAudios, audios } from "~/hooks/createAudios";
import { addPlaylists, playlists } from "~/hooks/createPlaylists";
import { accessToken } from "~/hooks/useSignIn";

import { Load } from "./Load";
import { styleSettings } from "./style.css";

/**
 * now playing audio info view
 */
export const Settings = () => {
  return (
    <div class={styleSettings}>
      <Load load={uploadLibrary}>
        <IconUpload />
        send library data to google drive
      </Load>
      <Load load={downloadLibrary}>
        <IconDownload />
        get library data from google drive
      </Load>
      <Load load={uploadPlaylists}>
        <IconUpload />
        send playlist data from google drive
      </Load>
      <Load load={downloadPlaylists}>
        <IconDownload />
        get playlist data from google drive
      </Load>
    </div>
  );
};

const uploadLibrary = async () => {
  const token = accessToken();
  if (token === undefined) throw new Error("not logged in");

  const response = await sendLibrary(token, Array.from(audios().entries()));
  if (response.status !== 200) throw new Error(response.statusText);
};

const downloadLibrary = async () => {
  const token = accessToken();
  if (token === undefined) throw new Error("not logged in");

  const data = await getLibrary(token);
  if (data === null) throw new Error("data not found");
  addAudios(data);
};

const uploadPlaylists = async () => {
  const token = accessToken();
  if (token === undefined) throw new Error("not logged in");

  const response = await sendPlaylists(
    token,
    Array.from(playlists().entries())
  );
  if (response.status !== 200) throw new Error(response.statusText);
};

const downloadPlaylists = async () => {
  const token = accessToken();
  if (token === undefined) throw new Error("not logged in");

  const data = await getPlaylists(token);
  if (data === null) throw new Error("data not found");
  addPlaylists(data);
};
