import {h, iconLayers, iconHome} from "/js/src/index.js";

function pathNQuery(page, index) {
    return `/Rct-Data/?page=${page}&index=${index}&rowsOnSite=50&site=1`;
}

export default function alonePageButton(model, title, page, index) {
    return [h('.menu-title', {
        class: model.router.params.page === page ? 'currentMenuItem' : ''
    }, title),
        h('a.menu-item', {
            title: title,
            style: 'display:flex',
            href: pathNQuery(page, index),
            onclick: (e) => model.router.handleLinkEvent(e),
            class: model.router.params.page === page? 'selected' : ''
        }, [
            h('span', iconLayers(), ' ', title)
        ])]
}