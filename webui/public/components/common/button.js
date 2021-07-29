import { h } from '/js/src/index.js';

export default function button(label, onclickAction, id = '', href = undefined) {
    //if (typeof(href) != "undefined") return h('button.myFinalButton', {id: id, onclick: onclickAction, href = href}, label);
    return h('button.myFinalButton', {id: id, onclick: onclickAction}, label);
}
