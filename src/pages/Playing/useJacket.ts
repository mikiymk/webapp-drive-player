import { batch, createEffect, createSignal } from "solid-js";

import type { Accessor } from "solid-js";

const useJacket = (picture: Accessor<ArrayBuffer | undefined>) => {
  const [jacket, setJacket] = createSignal<string>();
  const defaultBuffer = new ArrayBuffer(0);

  createEffect((prev) => {
    const pictureBuffer = picture() ?? defaultBuffer;
    if (prev === pictureBuffer) {
      return prev;
    }

    batch(() => {
      const jacketURL = jacket();
      if (jacketURL !== undefined) {
        URL.revokeObjectURL(jacketURL);
        setJacket();
      }

      if (pictureBuffer.byteLength !== 0) {
        const createdUrl = URL.createObjectURL(new Blob([pictureBuffer]));
        setJacket(createdUrl);
      }
    });

    return pictureBuffer;
  });

  return jacket;
};

export default useJacket;
