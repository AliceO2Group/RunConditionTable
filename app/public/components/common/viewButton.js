import { h } from '/js/src/index.js';

export default function viewButton(model, label, onclickAction, id = '', href = undefined, adClasses='', margin='.m1', forceButton=false) {
    let buttonType = '.btn' + adClasses + margin;

    if (typeof(href) !== "undefined" && !forceButton)
        return h('a' + buttonType, {id: id, onclick: onclickAction, href: href}, label);
    return h('button' + buttonType, {id: id, onclick: onclickAction}, label);
}
