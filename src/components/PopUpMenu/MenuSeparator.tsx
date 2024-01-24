import { menuHorizon } from "./style.css";

/** show on right click */
export const MenuSeparator = () => {
  // biome-ignore lint/a11y/useAriaPropsForRole: <explanation>
  return <div class={menuHorizon} role="separator" />;
};
