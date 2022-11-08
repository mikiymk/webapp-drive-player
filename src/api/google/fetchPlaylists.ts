import { getGoogleFile } from "./file";
import { getFileID } from "./metadata";
import { createAppData, uploadAppData } from "./uploadFile";

import type { PlaylistEntries } from "~/signals/playlists";

let playlistsID: string | undefined;
const getPlaylistsID = async (
  token: string,
  fileName: string,
): Promise<string | undefined> => {
  if (playlistsID !== undefined) return playlistsID;

  playlistsID = await getFileID(token, fileName, true);
  return playlistsID;
};

export const getPlaylists = async (
  token: string,
  fileName: string,
): Promise<PlaylistEntries | null> => {
  const id = await getPlaylistsID(token, fileName);
  if (id === undefined) return null;

  const response = await getGoogleFile(token, id);
  if (response === undefined) return null;

  return response.json() as Promise<PlaylistEntries>;
};

export const sendPlaylists = async (
  token: string,
  fileName: string,
  data: PlaylistEntries,
): Promise<Response> => {
  const id = await getPlaylistsID(token, fileName);
  const jsonData = JSON.stringify(data);

  if (id !== undefined) {
    return uploadAppData(token, id, jsonData);
  } else {
    return createAppData(token, fileName, jsonData);
  }
};
