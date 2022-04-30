import type { BindParams, ParamsObject } from "sql.js";
import { isStrStrict } from "~/hooks/isType";

const createFiles = (
  select: (sql: string, values?: BindParams | undefined) => ParamsObject[],
  insert: (sql: string, values?: BindParams[] | undefined) => void
) => {
  const files = () => {
    const files = select("SELECT `id`, `title` FROM `audio`;")
      .map(param => ({
        id: isStrStrict(param["id"]),
        name: isStrStrict(param["title"]),
      }))
      .map(file => [file.id, file]);
    return Object.fromEntries(files);
  };

  const file = (id: string) => {
    const result = select("SELECT * FROM `audio` WHERE `id` = :id;", {
      ":id": id,
    });

    return result[0];
  };

  const addFiles = (newFiles: { id: string; name: string }[]) => {
    const ids = select("SELECT `id` FROM `audio`;").map(param =>
      isStrStrict(param["id"])
    );
    const inserts = newFiles
      .filter(file => !(file.id in ids))
      .map(({ id, name }) => ({ ":id": id, ":title": name }));
    insert(
      "INSERT INTO `audio` (`id`, `title`) VALUES (:id, :title);",
      inserts
    );
  };

  return {
    file,
    files,
    addFiles,
  };
};

export default createFiles;
