import { styleImage, styleNoImage, styleNoImageBG } from "./style.css";

/**
 * no image available
 */
export const NoImage = () => {
  return (
    <svg class={`${styleImage} ${styleNoImage}`} viewBox="0 0 100 100">
      <path d="M0,0V100H100V0" class={styleNoImageBG} />
      <text x="50%" y="25">
        no image
      </text>
      <text x="50%" y="38">
        available
      </text>
      <path
        d="M17,27L22,33L29,24L38,36H10M38,42A4,4 0 0,0 42,38V10A4,4 0 0,0 38,6H10A4,4 0 0,0 6,10V38A4,4 0 0,0 10,42"
        transform="translate(26 45)"
      />
    </svg>
  );
};
