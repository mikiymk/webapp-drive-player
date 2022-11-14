interface TopMenuProps {
  select: (select: string) => void;
}

export const TopMenu = (props: TopMenuProps) => {
  return (
    <ul>
      <li>
        <button onClick={() => props.select("songs")}>Songs</button>
      </li>
      <li>
        <button onClick={() => props.select("albums")}>Albums</button>
      </li>
      <li>
        <button onClick={() => props.select("artists")}>Artists</button>
      </li>
    </ul>
  );
};
