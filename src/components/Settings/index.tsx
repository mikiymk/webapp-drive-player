import { Download } from "./Download";
import { styleSettings } from "./style.css";
import { Upload } from "./Upload";

export type SettingsProps = {
  accessToken: string;
};

/**
 * now playing audio info view
 */
export const Settings = (props: SettingsProps) => {
  return (
    <div class={styleSettings}>
      <Upload accessToken={props.accessToken} />
      <Download accessToken={props.accessToken} />
    </div>
  );
};
