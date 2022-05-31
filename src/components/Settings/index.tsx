import { Download } from "./Download";
import { Upload } from "./Upload";
import { styleSettings } from "./style.css";

/**
 * now playing audio info view
 */
export const Settings = () => {
  return (
    <div class={styleSettings}>
      <Upload />
      <Download />
    </div>
  );
};
