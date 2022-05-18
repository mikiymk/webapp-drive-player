type RepeatType = "repeat off" | "repeat one" | "repeat on";

/**
 * 「なし→全部→１つ→なし」の切り替えをする
 */
export class Repeat {
  static readonly ON = new Repeat("repeat on");
  static readonly OFF = new Repeat("repeat off");
  static readonly ONE = new Repeat("repeat one");

  static get DEFAULT() {
    return Repeat.OFF;
  }

  readonly value: RepeatType;

  private constructor(repeat: RepeatType) {
    this.value = repeat;
  }

  /**
   * １つ切り替える
   */
  toggle(): Repeat {
    switch (this.value) {
      case "repeat off":
        return Repeat.ON;
      case "repeat on":
        return Repeat.ONE;
      case "repeat one":
        return Repeat.OFF;
      default:
        return Repeat.DEFAULT;
    }
  }
}
