
export const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
export const serialIf = (n, ifTrue, ifFalse, conditions) =>
    zip(zip(ifTrue, ifFalse), conditions).reduce(
        (acc, ent) => acc + (Boolean(ent[1]) ? ent[0][0] : ent[0][1]),
        n)
