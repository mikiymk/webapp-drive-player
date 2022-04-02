import { useState, useEffect, useCallback } from "react";

const useSeekTime = (time: number, seek: (time: number) => void) => {
  const [seekTime, setSeekTime] = useState(0);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (!click) {
      setSeekTime(Math.round(time * 1000));
    }
  }, [time]);

  const onClickDown = useCallback(() => {
    setClick(true);
  }, []);

  const onClickUp = useCallback(() => {
    setClick(false);
    seek(seekTime / 1000);
  }, [seek, seekTime]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      setSeekTime(parseInt(event.target.value, 10));
    },
    []
  );

  return {
    seekTime,
    onChange,
    onClickDown,
    onClickUp,
  };
};

export default useSeekTime;
