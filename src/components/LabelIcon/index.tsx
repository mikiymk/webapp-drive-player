import Icon from "~/components/GoogleIcon";
import { styleIcon, styleLabel } from "./style.css";

type Props = {
  icon: string;
  text: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon = (props: Props) => {
  return (
    <span>
      <Icon icon={props.icon} class={styleIcon} />
      <span class={`${styleIcon} ${styleLabel}`}>{props.text}</span>
    </span>
  );
};

export default LabelIcon;
