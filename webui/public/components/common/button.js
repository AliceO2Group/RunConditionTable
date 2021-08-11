import { h } from '/js/src/index.js';

export default function button(model, label, onclickAction, id = '', href = undefined) {
    var buttonType = '.myFinalButton';
    if (model.router) {
        const url = model.router.getUrl();
        if (id === (url.pathname + url.search))
            buttonType = '.myActiveButton';
    }

    if (typeof(href) !== "undefined")
        return h('a' + buttonType, {id: id, onclick: onclickAction, href: href}, label);
    return h('button' + buttonType, {id: id, onclick: onclickAction}, label);
}
