import { createEffect, createSignal } from "solid-js";

const useJacket = (picture?: ArrayBuffer) => {
  const [jacket, setJacket] = createSignal("");
  const defaultBuffer = new ArrayBuffer(0);
  const pictureBuffer = picture ?? defaultBuffer;

  createEffect(prev => {
    if (prev === pictureBuffer) {
      return prev;
    }
    if (jacket() !== "") {
      URL.revokeObjectURL(jacket());
      setJacket("");
    }
    if (pictureBuffer !== defaultBuffer) {
      const createdUrl = URL.createObjectURL(new Blob([pictureBuffer]));
      setJacket(createdUrl);
    }

    return pictureBuffer;
  });

  return jacket;
};

export default useJacket;
