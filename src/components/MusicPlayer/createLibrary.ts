import { createEffect, createResource, createSignal } from "solid-js";
import init from "sql.js";
import type { BindParams, Database, ParamsObject } from "sql.js";

export type SelectDB = (
  sql: string,
  values?: BindParams | undefined
) => ParamsObject[];
export type UpdateDB = (sql: string, values?: BindParams[] | undefined) => void;

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
      "CREATE TABLE `audio` (" +
        "`id` TEXT PRIMARY KEY, " +
        "`title` TEXT NOT NULL, " +
        "`artists` TEXT, " +
        "`album` TEXT, " +
        "`album_artist` TEXT, " +
        "`track` INTEGER, " +
        "`track_of` INTEGER, " +
        "`disk` INTEGER, " +
        "`disk_of` INTEGER, " +
        "`release_at` TEXT, " +
        "`genre` TEXT, " +
        "`picture` NONE, " +
        "`album_sort` TEXT, " +
        "`title_sort` TEXT, " +
        "`artist_sort` TEXT, " +
        "`album_artist_sort` TEXT);"
    );

    db.exec(
      "CREATE TABLE `playlist` (" +
        "`name` TEXT UNIQUE NOT NULL, " +
        "`sort_key` INTEGER UNIQUE NOT NULL);"
    );
    db.exec(
      "CREATE TABLE `playlist_audio` (" +
        "`name` TEXT NOT NULL, " +
        "`audio_id` TEXT NOT NULL, " +
        "`sort_key` INTEGER UNIQUE NOT NULL, " +
        "FOREIGN KEY (`name`) REFERENCES `playlist_audio` (`name`)" +
        "FOREIGN KEY (`audio_id`) REFERENCES `audio` (`id`));"
    );

    db.exec("CREATE TABLE `settings` (`setting` TEXT);");

    setDatabase(db);
  });

  const select: SelectDB = (sql: string, values?: BindParams) => {
    const db = database();
    if (db === undefined) return [];
    const stmt = db.prepare(sql);
    stmt.bind(values);
    const result = [];
    while (stmt.step()) result.push(stmt.getAsObject());
    stmt.free();

    return result;
  };

  const update: UpdateDB = (sql: string, values?: BindParams[]) => {
    const db = database();
    if (db === undefined) return;
    if (values === undefined) return;

    const stmt = db.prepare(sql);
    for (const value of values) {
      stmt.run(value);
    }
    stmt.free();

    console.log("update database", sql, values, db);

    setDatabase(db => db);
  };

  return {
    database,
    select,
    update,
  };
};

export default createLibrary;
