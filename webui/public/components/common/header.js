import { h } from '/js/src/index.js';

export default function header(model) {
    return h('.bg-white.flex-row.p2.shadow-level2.level2', {id: 'menu'}, [
        h('.flex-grow.text-left', [
            h('button.btn', {onclick: e => alert('TODO')}, 'opts')
        ]), ' ',
        h('.w-50.text-center', [
            h('h4.primary', 'TEST APP PANEL')
        ]), ' ',
        h('.flex-grow', [
            h('input', {id: 'main-panel-search', placeholder: 'search', type: 'input'})
        ]), ' ',
        h('flex-grow.text-right', [
            h('button.btn', {onclick: e => model.logout()}, 'logout')
        ]),
    ]);
}