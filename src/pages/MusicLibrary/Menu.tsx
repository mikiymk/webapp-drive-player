type TopMenuProps = {
  select: (select: string) => void;
};

export const TopMenu = (props: TopMenuProps) => {
  return (
    <ul>
      <li>
        <button onclick={[props.select, "songs"]}>Songs</button>
      </li>
      <li>
        <button onclick={[props.select, "albums"]}>Albums</button>
      </li>
      <li>
        <button onclick={[props.select, "artists"]}>Artists</button>
      </li>
    </ul>
  );
};
