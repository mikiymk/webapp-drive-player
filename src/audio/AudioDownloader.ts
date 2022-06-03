import { downloadFile } from "~/google/downloadFile";

import { AudioInfo } from "./AudioInfo";

const downloadeds: {
  id: string;
  token: string;
  data: Promise<Blob | null>;
  info: Promise<AudioInfo>;
}[] = [];

/**
 *
 * @param id
 * @param token
 * @returns
 */
export const downloadAudio = (
  id: string,
  token: string
): { data: Promise<Blob | null>; info: Promise<AudioInfo> } => {
  const cached = downloadeds.find(
    cached => id === cached.id && token === cached.token
  );
  if (cached) {
    const { data, info } = cached;
    return { data, info };
  }

  const data = downloadAudioPromise(id, token);
  const info = data.then(data => {
    if (data === null) {
      return AudioInfo.getEmptyInfo();
    }
    return AudioInfo.getInfo(data.slice());
  });

  downloadeds.shift();
  downloadeds.push({ id, token, data, info });

  return { data, info };
};

const downloadAudioPromise = async (
  id: string,
  token: string
): Promise<Blob | null> => {
  try {
    const fileData = await downloadFile(token, id);

    if (fileData === null) {
      return null;
    }

    return await fileData.blob();
  } catch {
    return null;
  }
};
