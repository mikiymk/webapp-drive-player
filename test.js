(() => {
  const performance = require("perf_hooks").performance;
  const marr = (length) =>
    Array.from({ length }).map((_, i) => [`s_${i}`, i * i]);
  const mmap = (l) => new Map(marr(l));
  const len = 1000;
  const cnt = 10000;

  const test = (label, fn) => {
    const times = [];
    for (let i = 0; i < cnt; i++) {
      const t0 = performance.now();
      fn(mmap(len), marr(len));
      const t1 = performance.now();
      times.push(t1 - t0);
    }
    const ave = times.reduce((p, c) => p + c) / cnt;
    const vari = times.reduce((p, c) => p + (c - ave) ** 2) / cnt;
    const err = Math.sqrt(vari / (cnt - 1)) * 100;

    return `${label} ${ave.toFixed(4)}±${err.toFixed(2)}%`;
  };

  let a;
  a = test("foreach", (m, a) => {
    const n = new Map(m);
    // biome-ignore lint/complexity/noForEach: <explanation>
    a.forEach((aa) => n.set(aa[0] + aa[0], aa[1] + 1));
    return n;
  });
  console.log(a);

  a = test("map    ", (m, a) => {
    const n = new Map([...m, ...a.map((aa) => [aa[0] + aa[0], aa[1] + 1])]);
    return n;
  });
  console.log(a);

  a = test("for in ", (m, a) => {
    const n = new Map(m);
    for (const i in a) {
      const aa = a[i];
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);

  a = test("for of ", (m, a) => {
    const n = new Map(m);
    for (const aa of a) {
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);

  a = test("for i  ", (m, a) => {
    const n = new Map(m);
    for (let i = 0; i < a.length; i++) {
      const aa = a[i];
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);
})();
