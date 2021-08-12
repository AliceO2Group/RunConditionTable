import { h } from '/js/src/index.js';

export default function button(model, label, onclickAction, id = '', href = undefined, adClasses='') {
    var buttonType = '.myFinalButton' + adClasses;
    if (model.router) {
        const url = model.router.getUrl();
        if (href === (url.pathname + url.search))
            buttonType = '.myActiveButton' + adClasses;
    }

    if (typeof(href) !== "undefined")
        return h('a' + buttonType, {id: id, onclick: onclickAction, href: href}, label);
    return h('button' + buttonType, {id: id, onclick: onclickAction}, label);
}
