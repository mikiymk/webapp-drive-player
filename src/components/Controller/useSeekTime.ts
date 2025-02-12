import { createEffect, createSignal } from "solid-js";

import type { Accessor, JSX } from "solid-js";

export const useSeekTime = (
  time: Accessor<number>,
  seek: (time: number) => void,
) => {
  const [seekTime, setSeekTime] = createSignal(0);
  const [click, setClick] = createSignal(false);

  createEffect(() => {
    if (!click()) {
      setSeekTime(Math.round(time() * 1000));
    }
  });

  const onClickDown = () => {
    setClick(true);
  };

  const onClickUp = () => {
    seek(seekTime() / 1000);
    setClick(false);
  };

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    setSeekTime(Number.parseInt(event.currentTarget.value, 10));
  };

  return {
    seekTime,
    onChange,
    onClickDown,
    onClickUp,
  };
};
