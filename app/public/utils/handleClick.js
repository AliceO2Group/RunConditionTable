


export default function handleClick(model, e) {
    model.router.handleLinkEvent(e);
    model.notify();
}