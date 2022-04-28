import { createEffect, createResource, createSignal } from "solid-js";
import init, { Database } from "sql.js";

const createLibrary = () => {
  const [database, setDatabase] = createSignal<Database>();
  const [sqlAccessor] = createResource(() =>
    init({
      locateFile: file =>
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/" + file,
    })
  );

  createEffect(() => {
    const sql = sqlAccessor();
    if (sql === undefined) return;

    setDatabase(new sql.Database());
  });

  return database;
};

export default createLibrary;
