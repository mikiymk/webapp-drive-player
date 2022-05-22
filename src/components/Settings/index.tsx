import { Download } from "./Download";
import { Upload } from "./Upload";
import { styleSettings } from "./style.css";

export type SettingsProps = {
  accessToken: string | undefined;
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
