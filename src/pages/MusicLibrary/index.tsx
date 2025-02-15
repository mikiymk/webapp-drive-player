import { Match, Switch, createSignal } from "solid-js";

import { Albums } from "./Albums";
import { Artists } from "./Artists";

import { TopMenu } from "./Menu";
import { Songs } from "./Songs";

interface LibraryProps {
  play: (idList: readonly string[], index: number) => void;
}

/**
 * list of musics
 */
export const Library = (props: LibraryProps) => {
  const [selectTab, setSelectTab] = createSignal<string>();
  const resetTab: () => void = () => {
    setSelectTab();
  };
  return (
    <Switch fallback={<TopMenu select={setSelectTab} />}>
      <Match when={selectTab() === "songs"}>
        <Songs reset={resetTab} play={props.play} />
      </Match>

      <Match when={selectTab() === "albums"}>
        <Albums reset={resetTab} play={props.play} />
      </Match>

      <Match when={selectTab() === "artists"}>
        <Artists reset={resetTab} play={props.play} />
      </Match>
    </Switch>
  );
};
