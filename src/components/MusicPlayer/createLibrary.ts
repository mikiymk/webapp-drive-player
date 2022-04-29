import { createEffect, createResource, createSignal } from "solid-js";
import init, { BindParams, Database } from "sql.js";

const createLibrary = () => {
  const [database, setDatabase] = createSignal<Database | undefined>(
    undefined,
    { equals: false }
  );
  const [sqlAccessor] = createResource(() =>
    init({
      locateFile: file =>
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/" + file,
    })
  );

  createEffect(() => {
    const sql = sqlAccessor();
    if (sql === undefined) return;

    const db = new sql.Database();

    db.exec(
      "CREATE TABLE `audio` (`id` TEXT PRIMARY KEY, `title` TEXT, `artists` TEXT, " +
        "`album` TEXT, `album_artist` TEXT, `track` INTEGER, " +
        "`track_of` INTEGER, `disk` INTEGER, `disk_of` INTEGER, " +
        "`release_at` TEXT, `genre` TEXT, `picture` NONE, `album_sort` TEXT, " +
        "`title_sort` TEXT, `artist_sort` TEXT, `album_artist_sort` TEXT)"
    );

    db.exec(
      "CREATE TABLE `playlist` (`name` TEXT, `sort` INTEGER, `audio_id` TEXT)"
    );

    db.exec("CREATE TABLE `settings` (`setting` TEXT)");

    db.create_function(
      "js_updated",
      () => (setDatabase(prev => (console.log("update database"), prev)), 1)
    );

    db.exec(
      "INSERT INTO `audio` (`id`, `title`, `artists`, `album`, " +
        "`album_artist`, `track`, `track_of`, `disk`, `disk_of`, " +
        "`release_at`, `genre`, `picture`, `album_sort`, " +
        "`title_sort`, `artist_sort`, `album_artist_sort`) VALUES ('id-1', " +
        "'title', 'artists', 'album', 'album_artist', 1, 1, 1, 2, '1900-01-01', 'genre', " +
        "'picture', 'album_sort', 'title_sort', 'artist_sort', 'album_artist_sort')"
    );
    db.exec(
      "INSERT INTO `audio` (`id`, `title`, `artists`, `album`, " +
        "`album_artist`, `track`, `track_of`, `disk`, `disk_of`, " +
        "`release_at`, `genre`, `picture`, `album_sort`, " +
        "`title_sort`, `artist_sort`, `album_artist_sort`) VALUES ('id-2', " +
        "'title', 'artists', 'album', 'album_artist', 1, 1, 1, 2, '1900-01-01', 'genre', " +
        "'picture', 'album_sort', 'title_sort', 'artist_sort', 'album_artist_sort')"
    );
    db.exec(
      "INSERT INTO `audio` (`id`, `title`, `artists`, `album`, " +
        "`album_artist`, `track`, `track_of`, `disk`, `disk_of`, " +
        "`release_at`, `genre`, `picture`, `album_sort`, " +
        "`title_sort`, `artist_sort`, `album_artist_sort`) VALUES ('id-3', " +
        "'title', 'artists', 'album', 'album_artist', 1, 1, 1, 2, '1900-01-01', 'genre', " +
        "'picture', 'album_sort', 'title_sort', 'artist_sort', 'album_artist_sort')"
    );

    setDatabase(db);
  });

  const select = (sql: string, values?: BindParams) => {
    const db = database();
    if (db === undefined) return [];
    const stmt = db.prepare(sql);
    stmt.bind(values);
    const result = [];
    while (stmt.step()) result.push(stmt.getAsObject());
    stmt.free();

    return result;
  };

  const insert = (sql: string, values?: BindParams[]) => {
    const db = database();
    if (db === undefined) return;
    if (values === undefined) return;

    const stmt = db.prepare(sql);
    for (const value of values) {
      stmt.run(value);
    }
    stmt.free();

    setDatabase(db => (console.log("update database", db), db));
  };

  return {
    database,
    select,
    insert,
  };
};

export default createLibrary;
