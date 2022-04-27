import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  class?: string;
};

/** Google Material Icon */
const Icon = (props: Props) => {
  let classes = `material-icons-sharp ${styleIcon}`;
  if (props.class !== undefined) {
    classes = `material-icons-sharp ${styleIcon} ${props.class}`;
  }

  return <span class={classes}>{props.icon}</span>;
};

export default Icon;
