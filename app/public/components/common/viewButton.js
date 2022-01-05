import { h } from '/js/src/index.js';

export default function viewButton(model, label, onclickAction, id = '', href = undefined, adClasses='', margin='.m1', forceButton=false) {
    let buttonType = '.btn' + adClasses + margin;

    if (model.router && href !== undefined) {
        const url = model.router.getUrl();
        if (href === (url.pathname + url.search) || (href.hasOwnProperty('href') && (href.href === url.href)))
            buttonType += 'selected';
    }

    if (typeof(href) !== "undefined" && !forceButton)
        return h('a' + buttonType, {id: id, onclick: onclickAction, href: href}, label);
    return h('button' + buttonType, {id: id, onclick: onclickAction}, label);
}
