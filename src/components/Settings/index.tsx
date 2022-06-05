import { createSignal } from "solid-js";

import { IconDownload, IconUpload } from "~/components/Icon";
import { getLibrary, sendLibrary } from "~/google/fetchLibrary";
import { getPlaylists, sendPlaylists } from "~/google/fetchPlaylists";
import { addAudios, audios } from "~/hooks/createAudios";
import { addPlaylists, playlists } from "~/hooks/createPlaylists";
import { accessToken } from "~/hooks/useSignIn";

import { Load } from "./Load";
import { styleSettings } from "./style.css";

import type { Setter } from "solid-js";

type SettingsProps = {
  setPlayer: Setter<"bufsrc" | "elemsrc" | "elem">;
};

const [player, setPlayer] = createSignal<"bufsrc" | "elemsrc" | "elem">(
  "bufsrc"
);

/**
 * now playing audio info view
 */
export const Settings = (props: SettingsProps) => {
  const handleClick = (value: "bufsrc" | "elemsrc" | "elem") => {
    setPlayer(value);
    props.setPlayer(value);
  };

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
      <fieldset>
        <p>select player</p>
        <label>
          BufferSource{" "}
          <input
            type="radio"
            name="player"
            onclick={[handleClick, "bufsrc"]}
            checked={player() === "bufsrc"}
          />
        </label>
        <label>
          ElementSource
          <input
            type="radio"
            name="player"
            onclick={[handleClick, "elemsrc"]}
            checked={player() === "elemsrc"}
          />
        </label>
        <label>
          Element
          <input
            type="radio"
            name="player"
            onclick={[handleClick, "elem"]}
            checked={player() === "elem"}
          />
        </label>
      </fieldset>
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
