import button from "./button.js";
import {h} from '/js/src/index.js'
import handleClick from "./handleClick.js";

function sectionTitle(label) {
    return h('.br4.black.bg-primary.f4.text-center.w-75', label)
}

export default function fetchedDataSection(model, pageName, label) {
    const page = model.fetchedData[pageName]
    const buttons = [];
    if (pageName !== null) {
        for (var index in page) {
            if (page.hasOwnProperty(index)) {
                const url = page[index].url;
                buttons.push(button(model, index, (e) => handleClick(model, e), '', url.pathname + url.search));
            }
        }
    }

    return h('.flex-wrap.item-center.justify-center',[
        sectionTitle(label),
        h('.flex-column', buttons)
    ]);
}