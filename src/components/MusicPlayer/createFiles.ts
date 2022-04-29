import type { BindParams, ParamsObject } from "sql.js";
import type { File } from "~/file";

const createFiles = (
  select: (sql: string, values?: BindParams | undefined) => ParamsObject[],
  insert: (sql: string, values?: BindParams[] | undefined) => void
) => {
  const files = () => {
    return select("SELECT * FROM `audio`;");
  };

  const file = (id: string) => {
    const result = select("SELECT * FROM `audio` WHERE `id` = :id;", {
      ":id": id,
    });

    return result[0];
  };

  const addFiles = (files: File[]) => {
    insert(
      "INSERT INTO `audio` (`id`, `title`) VALUES (:id, :title);",
      files.map(({ id, name }) => ({ ":id": id, ":title": name }))
    );
  };

  return {
    file,
    files,
    addFiles,
  };
};

export default createFiles;
