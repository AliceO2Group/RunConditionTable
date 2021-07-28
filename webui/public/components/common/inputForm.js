import { h } from '/js/src/index.js';

export default function inputForm(label, id, placeholder, hide = false) {
    return h('form', [
        h('label', {for: label}, ""),
        h('input', {id: id, type: hide? 'password' : 'input', placeholder: placeholder}, '')
    ]);
}