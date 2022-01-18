import {h, iconLayers, iconHome} from "/js/src/index.js";
import {getPathElem} from "../../../utils/utils.js";

function pathNQuery(page, index) {
    return `/${page}/${index}/?&rowsOnSite=50&site=1`;
}

export default function alonePageButton(model, title, page, index) {

    const currentPage = getPathElem(model.router.getUrl().pathname, 0)
    return [h('.menu-title', {
        class: currentPage === page ? 'currentMenuItem' : ''
    }, title),
        h('a.menu-item', {
            title: title,
            style: 'display:flex',
            href: pathNQuery(page, index),
            onclick: (e) => model.router.handleLinkEvent(e),
            class: currentPage === page? 'selected' : ''
        }, [
            h('span', iconLayers(), ' ', title)
        ])]
}