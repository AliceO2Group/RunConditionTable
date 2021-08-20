
export const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
export const serialIf = (n, ifTrue, ifFalse, conditions) =>
    zip(zip(ifTrue, ifFalse), conditions).reduce(
        (acc, ent) => acc + (Boolean(ent[1]) ? ent[0][0] : ent[0][1]),
        n)

export function replaceUrlParams(url, entries) {
    const currentParams = Object.fromEntries(url.searchParams.entries());
    for (let [k, v] of entries) {
        currentParams[k] = v;
    }
    const serach = '?' + (Object.entries(currentParams).map(([k, v]) => `${k}=${v}`)).join('&');
    return new URL(url.origin + url.pathname + serach);
}

export function range(from, to) {
    return Array.from({length: to - from}, (v, k) => k+from);
}