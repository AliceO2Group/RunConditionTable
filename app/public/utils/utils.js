
export const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
export const reduceSerialIf = (n, ifTrue, ifFalse, conditions) =>
    zip(zip(ifTrue, ifFalse), conditions).reduce(
        (acc, ent) => acc + (Boolean(ent[1]) ? ent[0][0] : ent[0][1]),
        n)

export function replaceUrlParams(url, entries) {
    const currentParams = Object.fromEntries(url.searchParams.entries());
    for (let [k, v] of entries) {
        currentParams[k] = v;
    }

    const search = '?' + (Object.entries(currentParams).map(([k, v]) => `${k}=${v}`)).join('&');
    return new URL(url.origin + url.pathname + search);
}

export function range(from, to) {
    return Array.from({length: to - from}, (v, k) => k+from);
}

export function url2Str(url) {
    return url.pathname + url.search
}


export function getPathElems(pathname) {
    console.assert(pathname[0] === '/')
    console.assert(pathname.slice(-1) === '/')
    return pathname.slice(1, -1).split('/')
}

export function getPathElem(pathname, i) {
    return getPathElems(pathname)[i];
}

export function urlSearchToParams(search) {
    console.assert(search[0] === '?')
    return Object.fromEntries(search.slice(2).split('\&').map((ent) => ent.split('=')))
}