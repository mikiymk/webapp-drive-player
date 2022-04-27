import { File } from "~/file";
import Download from "./Download";
import { styleSettings } from "./style.css";
import Upload from "./Upload";

type Props = {
  files: File[];
  addFiles: (file: File[]) => void;
  accessToken: string;
};

/**
 * now playing audio info view
 */
const Settings = (props: Props) => {
  return (
    <div class={styleSettings}>
      <Upload files={props.files} accessToken={props.accessToken} />
      <Download addFiles={props.addFiles} accessToken={props.accessToken} />
    </div>
  );
};

export default Settings;
