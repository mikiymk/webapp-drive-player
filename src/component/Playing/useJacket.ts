import { useEffect, useState, useRef } from "react";

const useJacket = (picture?: ArrayBuffer) => {
  const [jacket, setJacket] = useState("");
  const defaultBuffer = useRef(new ArrayBuffer(0));
  const pictureBuffer = picture ?? defaultBuffer.current;

  useEffect(() => {
    if (jacket !== "") {
      URL.revokeObjectURL(jacket);
    }

    const createdUrl = URL.createObjectURL(new Blob([pictureBuffer]));
    setJacket(createdUrl);

    return () => {
      URL.revokeObjectURL(createdUrl);
      setJacket("");
    };
  }, [pictureBuffer]);

  return jacket;
};

export default useJacket;
