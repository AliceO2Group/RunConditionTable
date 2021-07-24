
export const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
export const goodBadOpt = (n, goodOpts, badOpts, opts) =>
    zip(zip(goodOpts, badOpts), opts).reduce(
        (acc, ent) => acc + (Boolean(ent[1]) ? ent[0][0] : ent[0][1]),
        n)
