import { Accessor, createEffect, createSignal, JSX } from "solid-js";

const useSeekTime = (time: Accessor<number>, seek: (time: number) => void) => {
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
    setClick(false);
    seek(seekTime() / 1000);
  };

  const onChange: JSX.EventHandler<HTMLInputElement, Event> = event => {
    setSeekTime(parseInt(event.currentTarget.value, 10));
  };

  return {
    seekTime,
    onChange,
    onClickDown,
    onClickUp,
  };
};

export default useSeekTime;
