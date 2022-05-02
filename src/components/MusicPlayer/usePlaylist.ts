import { isStrStrict } from "~/hooks/isType";
import type { SelectDB, UpdateDB } from "./createLibrary";

const usePlaylist = (select: SelectDB, update: UpdateDB) => {
  const playlists = () => {
    return select("SELECT `name` FROM `playlist` ORDER BY `sort_key`;").map(
      param => isStrStrict(param["name"])
    );
  };

  const playlist = (name: string) => {
    return select(
      "SELECT `audio_id`, `title` " +
        "FROM `playlist_audio` INNER JOIN `audio` ON `playlist_audio`.`audio_id` = `audio`.`id` " +
        "WHERE `name` = :name " +
        "ORDER BY `sort_key`;",
      { ":name": name }
    ).map(param => ({
      id: isStrStrict(param["audio_id"]),
      title: isStrStrict(param["audio_id"]),
    }));
  };

  const makePlaylist = (name: string) => {
    update(
      "INSERT INTO `playlist` (`name`, `sort_key`) " +
        "SELECT :name, CASE WHEN MAX(`sort_key`) IS NULL THEN 1 ELSE MAX(`sort_key`) + 1 END FROM `playlist`;",
      [{ ":name": name }]
    );
  };

  const deletePlaylist = (name: string) => {
    update("DELETE FROM `playlist` WHERE `name` = :name;", [{ ":name": name }]);
  };

  const addToPlaylist = (name: string, audioId: string) => {
    update(
      "INSERT INTO `playlist_audio` (`name`, `audio_id`, `sort_key`) " +
        "SELECT :name, :audio_id, CASE WHEN MAX(`sort_key`) IS NULL THEN 1 ELSE MAX(`sort_key`) + 1 END FROM `playlist_audio` " +
        "WHERE EXISTS (SELECT `name` FROM `playlist` WHERE `name` = :name);",
      [{ ":name": name, ":audio_id": audioId }]
    );
  };

  const removeFromPlaylist = (name: string, index: number) => {
    update(
      "DELETE FROM `playlist_audio` WHERE `name` = :name AND `sort_key` = :sort_key;",
      [{ ":name": name, ":sort_key": index + 1 }]
    );
  };

  return {
    playlist,
    playlists,

    makePlaylist,
    deletePlaylist,

    addToPlaylist,
    removeFromPlaylist,
  };
};

export default usePlaylist;
