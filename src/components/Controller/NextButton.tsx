import React, { memo } from "react";

import IconButton from "components/IconButton";

import { styleIcon } from "./style";

type Props = {
  next: () => void;
};

const NextButton: React.FC<Props> = memo(({ next }) => {
  return <IconButton icon="skip_next" onClick={next} className={styleIcon} />;
});

export default NextButton;
