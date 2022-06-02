(() => {
  const performance = require("perf_hooks").performance;
  let marr = length => Array.from({ length }).map((_, i) => ["s_" + i, i * i]);
  let mmap = l => new Map(marr(l));
  let len = 1000;
  let cnt = 10000;

  let test = (label, fn) => {
    let times = [];
    for (let i = 0; i < cnt; i++) {
      let t0 = performance.now();
      fn(mmap(len), marr(len));
      let t1 = performance.now();
      times.push(t1 - t0);
    }
    let ave = times.reduce((p, c) => p + c) / cnt;
    let vari = times.reduce((p, c) => p + (c - ave) ** 2) / cnt;
    let err = Math.sqrt(vari / (cnt - 1)) * 100;

    return `${label} ${ave.toFixed(4)}±${err.toFixed(2)}%`;
  };

  let a;
  a = test("foreach", (m, a) => {
    var n = new Map(m);
    a.forEach(aa => n.set(aa[0] + aa[0], aa[1] + 1));
    return n;
  });
  console.log(a);

  a = test("map    ", (m, a) => {
    var n = new Map([...m, ...a.map(aa => [aa[0] + aa[0], aa[1] + 1])]);
    return n;
  });
  console.log(a);

  a = test("for in ", (m, a) => {
    var n = new Map(m);
    for (let i in a) {
      let aa = a[i];
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);

  a = test("for of ", (m, a) => {
    var n = new Map(m);
    for (let aa of a) {
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);

  a = test("for i  ", (m, a) => {
    var n = new Map(m);
    for (let i = 0; i < a.length; i++) {
      let aa = a[i];
      n.set(aa[0] + aa[0], aa[1] + 1);
    }
    return n;
  });
  console.log(a);
})();
