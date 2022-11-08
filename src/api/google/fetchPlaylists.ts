import { getGoogleFile } from "./file";
import { getFileID } from "./metadata";
import { createAppData, uploadAppData } from "./uploadFile";

import type { PlaylistEntries } from "~/signals/playlists";

const FILE_NAME = "playlists.json";

let playlistsID: string | undefined;
const getPlaylistsID = async (accessToken: string) => {
  if (playlistsID !== undefined) return playlistsID;

  playlistsID = await getFileID(accessToken, FILE_NAME, true);
  return playlistsID;
};

export const getPlaylists = async (
  accessToken: string,
): Promise<PlaylistEntries | null> => {
  const id = await getPlaylistsID(accessToken);
  if (id === undefined) return null;

  const response = await getGoogleFile(accessToken, id);
  if (response === undefined) return null;
  return response.json();
};

export const sendPlaylists = async (token: string, data: PlaylistEntries) => {
  const id = await getPlaylistsID(token);
  const jsonData = JSON.stringify(data);

  if (id !== undefined) {
    return uploadAppData(token, id, jsonData);
  } else {
    return createAppData(token, FILE_NAME, jsonData);
  }
};