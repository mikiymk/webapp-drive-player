/**
 * time seconds number format to string mm:ss.SSS
 * @param time to format times
 * @returns formatted time string
 */
export const formatTime = (time: number): string => {
  const minute = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const second = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  const millisecond = Math.round((time % 1) * 1000)
    .toString()
    .padStart(3, "0");

  return `${minute}:${second}.${millisecond}`;
};
