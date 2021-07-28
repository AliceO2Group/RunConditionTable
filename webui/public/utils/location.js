
//TODO
export default function changeLocation (pathname) {
    const url = new URL(location);
    url.pathname = pathname;
    history.replaceState({}, '', url);
}