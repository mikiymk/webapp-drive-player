import { getGoogleFile } from "~/api/google/file";

import { AudioInfo } from "./AudioInfo";

const CACHE_LENGTH = 5;
const caches: {
  id: string;
  token: string;
  data: Promise<Blob | undefined>;
  info: Promise<AudioInfo>;
}[] = [];

/**
 *
 * @param id
 * @param token
 * @returns
 */
export const downloadAudio = (
  id: string | undefined,
  token: string | undefined,
): [Promise<Blob | undefined>, Promise<AudioInfo>] => {
  const cached = caches.find(
    (cache) => id === cache.id && token === cache.token,
  );
  if (cached) {
    const { data, info } = cached;
    return [data, info];
  }
  if (id === undefined || token === undefined) {
    return [
      Promise.resolve(undefined),
      Promise.resolve(AudioInfo.getEmptyInfo()),
    ];
  }

  const data = downloadAudioPromise(id, token);
  const info = data.then((data) => {
    if (data === undefined) {
      return AudioInfo.getEmptyInfo();
    }
    return AudioInfo.getInfo(data.slice());
  });

  caches.push({ id, token, data, info });
  if (caches.length > CACHE_LENGTH) {
    caches.shift();
  }

  return [data, info];
};

const downloadAudioPromise = async (
  id: string,
  token: string,
): Promise<Blob | undefined> => {
  try {
    const fileData = await getGoogleFile(token, id);

    if (fileData === undefined) {
      return undefined;
    }

    return await fileData.blob();
  } catch {
    return undefined;
  }
};
