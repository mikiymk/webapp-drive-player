import { Accessor, createEffect, createSignal } from "solid-js";

const useJacket = (picture: Accessor<ArrayBuffer | undefined>) => {
  const [jacket, setJacket] = createSignal("");
  const defaultBuffer = new ArrayBuffer(0);

  createEffect(prev => {
    const pictureBuffer = picture() ?? defaultBuffer;
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
