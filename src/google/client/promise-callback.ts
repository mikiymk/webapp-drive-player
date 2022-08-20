export class PromiseCallBack<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;

  constructor() {
    let resolveRef: (value: T | PromiseLike<T>) => void = () => {};
    let rejectRef: (reason?: unknown) => void = () => {};
    this.promise = new Promise((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    });
    this.resolve = resolveRef;
    this.reject = rejectRef;
  }
}
