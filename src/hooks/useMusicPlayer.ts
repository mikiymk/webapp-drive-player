import AudioManager from "~/audio/AudioManager";
import Repeat from "~/audio/Repeat";
import AudioInfo from "~/audio/AudioInfo";
import AudioElementPlayer from "~/audio/AudioElementPlayer";
import { Accessor, createEffect, createSignal, onMount } from "solid-js";
import type { BindParams, ParamsObject } from "sql.js";

const useMusicPlayer = (
  accessToken: Accessor<string>,
  select: (sql: string, values?: BindParams | undefined) => ParamsObject[],
  update: (sql: string, values?: BindParams[] | undefined) => void
) => {
  const [paused, setPaused] = createSignal(true);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [repeat, setRepeat] = createSignal(Repeat.DEFAULT);
  const [shuffle, setShuffle] = createSignal(false);

  const [info, setInfo] = createSignal(AudioInfo.getEmptyInfo());

  const player = new AudioElementPlayer();
  const manager = new AudioManager(player);

  const selectInfo = (id: string): AudioInfo | undefined => {
    const result = select("SELECT * FROM `audio` WHERE `id` = :id;", {
      ":id": id,
    })[0];
    if (result === undefined) return;

    const info = AudioInfo.selectInfo(result);
    return info;
  };

  const updateInfo = (id: string, info: AudioInfo): void => {
    update(
      "UPDATE `audio` SET `title` = :title, `artists` = :artists, " +
        "`album` = :album, `album_artist` = :album_artist, `track` = :track, " +
        "`track_of` = :track_of, `disk` = :disk, `disk_of` = :disk_of, " +
        "`release_at` = :release_at, `genre` = :genre, `picture` = :picture, " +
        "`album_sort` = :album_sort, `title_sort` = :title_sort, " +
        "`artist_sort` = :artist_sort, `album_artist_sort` = :album_artist_sort " +
        "WHERE `id` = :id;",
      [
        {
          ":id": id,
          ":title": info.title,
          ":artists": JSON.stringify(info.artists),
          ":album": info.album,
          ":album_artist": info.albumartist,
          ":track": info.track.no ?? null,
          ":track_of": info.track.of ?? null,
          ":disk": info.disk.no ?? null,
          ":disk_of": info.disk.of ?? null,
          ":release_at": info.date,
          ":genre": JSON.stringify(info.genre),
          ":picture": new Uint8Array(info.picture),
          ":album_sort": info.sort.albumsort,
          ":title_sort": info.sort.titlesort,
          ":artist_sort": info.sort.artistsort,
          ":album_artist_sort": info.sort.albumartistsort,
        },
      ]
    );
  };

  onMount(() => {
    manager.onSetDuration = duration => setDuration(duration);
    manager.onSetPause = paused => setPaused(paused);
    manager.onSetCurrentTime = currentTime => setCurrentTime(currentTime);
    manager.onSetRepeat = repeat => setRepeat(repeat);
    manager.onSetShuffle = shuffle => setShuffle(shuffle);

    manager.onLoadInfo = updateInfo;
  });

  createEffect(() => {
    manager.onChangeMusic = id =>
      setInfo(selectInfo(id) ?? AudioInfo.getEmptyInfo());
  });

  createEffect(() => {
    manager.setAccessToken(accessToken());
  });

  return {
    player: manager,
    status: {
      paused,
      duration,
      currentTime,
      repeat,
      shuffle,
      info,
    },
  };
};

export default useMusicPlayer;
