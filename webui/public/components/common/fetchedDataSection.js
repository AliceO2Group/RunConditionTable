import button from "./button.js";
import {h} from '/js/src/index.js'
import handleClick from "./handleClick.js";

function sectionTitle(label) {
    return h('.br4.black.bg-primary.f4.text-center.w-75', label)
}

function triButtonController(model, pageName, index) {
    const page = model.fetchedData[pageName]
    const url = page[index].url;
    const button1 = button(model, index, (e) => handleClick(model, e), '', url.pathname + url.search);
    return h('.flex-row', [
        button1, h('.d-inline', [
            h('button.bg-danger', {onclick: () => {
                    model.router.go('/home/?page=home'); // TODO
                    model.fetchedData.delete(pageName, index);
                    model.notify();
                }}, 'X'),
            h('.bg-primary', 'R')
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