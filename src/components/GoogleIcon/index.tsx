import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  class?: string;
};

/** Google Material Icon */
const Icon = (props: Props) => {
  const classes = () =>
    props.class
      ? `material-icons-sharp ${styleIcon} ${props.class}`
      : `material-icons-sharp ${styleIcon}`;

  return <span class={classes()}>{props.icon}</span>;
};

export default Icon;
