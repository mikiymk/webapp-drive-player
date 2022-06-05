import { createSignal, Match, Switch } from "solid-js";

import { TopMenu } from "./Menu";
import { Songs } from "./Songs";

export type LibraryProps = {
  play: (idList: readonly string[], index: number) => void;
};

/**
 * list of musics
 */
export const Library = (props: LibraryProps) => {
  const [selectTab, setSelectTab] = createSignal<string>();
  const resetTab = () => {
    setSelectTab();
  };
  return (
    <Switch fallback={<TopMenu select={setSelectTab} />}>
      <Match when={selectTab() === "songs"}>
        <Songs reset={resetTab} play={props.play} />
      </Match>
    </Switch>
  );
};
