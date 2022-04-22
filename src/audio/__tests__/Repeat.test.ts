import Repeat from "../Repeat";

const list = [Repeat.DEFAULT, Repeat.OFF, Repeat.ON, Repeat.ONE];

for (const item of list) {
  test("repeat", () => {
    expect(item.toggle()).not.toEqual(item);
    expect(item.toggle().toggle()).not.toEqual(item);
    expect(item.toggle().toggle().toggle()).toEqual(item);
  });
}
