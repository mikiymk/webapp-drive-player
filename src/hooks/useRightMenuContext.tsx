import Item from "~/components/RightMenu/Item";
import RightMenu from "~/components/RightMenu/RightMenu";
import { createSignal, JSX } from "solid-js";

const useRightMenuContext = () => {
  const [items, setItems] = createSignal<Item[]>([]);
  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  const setRightMenu: (
    item: Item[]
  ) => JSX.EventHandler<HTMLButtonElement, MouseEvent> = items => event => {
    setItems(items);
    setTop(event.clientY);
    setLeft(event.clientX);
  };

  const RightMenuComponent = (
    <RightMenu items={items()} top={top()} left={left()} />
  );

  return {
    value: { setRightMenu },
    RightMenu: RightMenuComponent,
  };
};

export default useRightMenuContext;
