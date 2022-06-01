import { IconDotInfo } from "~/components/Icon";
import { usePopMenu } from "~/components/PopUpMenu";

export type PlaylistListItemProps = {
  name: string;
};

export const PlaylistListItem = (props: PlaylistListItemProps) => {
  const popMenu = usePopMenu();
  return (
    <li oncontextmenu={popMenu}>
      {props.name}
      <button onClick={popMenu}>
        <IconDotInfo />
      </button>
    </li>
  );
};
