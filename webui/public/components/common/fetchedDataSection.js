import button from "./button.js";
import {h} from '/js/src/index.js'
import handleClick from "./handleClick.js";

function sectionTitle(label) {
    return h('.sectionTitle', label)
}

function triButtonController(model, pageName, index) {
    const page = model.fetchedData[pageName]
    const url = page[index].url;
    const button1 = button(model, index, (e) => handleClick(model, e), '', url.pathname + url.search, '.margin0', '');
    return h('.flex-row.appearance.w-100.m1.justify-between', [
        button1,
        h('.microBtnContainer', [
            h('a.microBtn', {onclick: () => {
                    model.router.go('/home/?page=home'); // TODO
                    model.fetchedData.delete(pageName, index);
                    model.notify();
                }}, 'X'),
            h('a.microBtn', 'R'),
            h('a.microBtn', 'C')
        ])
    ]);
}

export default function fetchedDataSection(model, pageName, label) {
    const page = model.fetchedData[pageName]
    const buttons = [];
    if (pageName !== null) {
        for (var index in page) {
            if (page.hasOwnProperty(index) && page[index] !== undefined && page[index] !== null) {
                buttons.push(triButtonController(model, pageName, index));
            }
        }
    }

    return h('.flex-wrap.item-center.justify-center',[
        sectionTitle(label),
        h('.flex-column', buttons)
    ]);
}