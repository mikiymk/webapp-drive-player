import { IconDotInfo } from "~/components/Icon";
import { usePopMenu } from "~/components/PopUpMenu";

export type PlaylistListItemProps = {
  name: string;
};

export const PlaylistListItem = (props: PlaylistListItemProps) => {
  const popMenu = usePopMenu();
  return (
    <li>
      {props.name}
      <button onClick={event => popMenu(event)}>
        <IconDotInfo />
      </button>
    </li>
  );
};
