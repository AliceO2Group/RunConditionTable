import { h } from '/js/src/index.js';

export default function button(label, onclickAction, id = '') {
    return h('button.btn.myButton', {id: id, onclick: onclickAction}, label);
}