import {h, iconLayers, iconHome} from "/js/src/index.js";
function pathNQuery(section, index, view) {
    return `/api/Rct-Data/?section=${section}&index=${index}&view=${view}&rowsOnPage=50&page=1`;
}
export default function aloneSectionButton(model, title, section, index, view) {
    return [h('.menu-title', {
        class: model.router.params.section === section ? 'currentMenuItem' : ''
    }, title),
        h('a.menu-item', {
            title: title,
            style: 'display:flex',
            href: pathNQuery(section, index, view),
            onclick: (e) => model.router.handleLinkEvent(e),
            class: model.router.params.section === section? 'myActiveButton' : ''
        }, [
            h('span', iconLayers(), ' ', title)
        ])]
}