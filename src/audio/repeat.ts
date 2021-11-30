type RepeatType = "repeat off" | "repeat one" | "repeat on";

class Repeat {
  readonly value: RepeatType;

  constructor(repeat?: RepeatType) {
    this.value = repeat ?? "repeat off";
  }

  /**
   * toggle off -> on -> one -> off
   */
  toggle(): Repeat {
    if (this.value === "repeat off") {
      return new Repeat("repeat on");
    } else if (this.value === "repeat on") {
      return new Repeat("repeat one");
    } else if (this.value === "repeat one") {
      return new Repeat("repeat off");
    }
    return new Repeat("repeat off");
  }

  /**
   * @returns same value object
   */
  copy(): Repeat {
    return new Repeat(this.value);
  }
}

export default Repeat;
