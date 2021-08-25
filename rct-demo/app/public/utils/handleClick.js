


export default function handleClick(model, e) {
    console.log('handelClick', e);
    model.router.handleLinkEvent(e);
    model.notify();
}