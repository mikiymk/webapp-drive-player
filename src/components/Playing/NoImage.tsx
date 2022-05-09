import { styleImage, styleNoImage } from "./style.css";

/**
 * no image available
 */
const NoImage = () => {
  return (
    <svg class={`${styleImage} ${styleNoImage}`} viewBox="0 0 10 10">
      <text x="50%" y="3">
        no image
      </text>
      <text x="50%" y="5">
        available
      </text>
      <path
        d="M0,26l7-9l5,6l7-9l9,12m0,6a4,4 0 0,0 4-4V0a4,4 0 0,0 -4-4H0a4,4 0 0,0-4,4V28a4,4 0 0,0 4,4"
        transform="translate(3.6 6.1)scale(.1)"
      />
    </svg>
  );
};

export default NoImage;
