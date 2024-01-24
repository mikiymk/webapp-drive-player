export class PromiseCallBack<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void = () => {
    // empty
  };
  reject: (reason?: unknown) => void = () => {
    // empty
  };

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
