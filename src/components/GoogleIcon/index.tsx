import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  className?: string;
};

/** Google Material Icon */
const Icon = (props: Props) => {
  let classes = `material-icons-sharp ${styleIcon}`;
  if (props.className !== undefined) {
    classes = `material-icons-sharp ${styleIcon} ${props.className}`;
  }

  return <span className={classes}>{props.icon}</span>;
};

export default Icon;
