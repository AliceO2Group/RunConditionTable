import button from "./button.js";
import {h} from '/js/src/index.js'
import handleClick from "./handleClick.js";

function sectionTitle(label) {
    return h('.sectionTitle', label)
}

function multiButtonController(model, pageName, index) {
    const page = model.fetchedData[pageName]
    const url = page[index].url;
    const button1 = button(model, index, (e) => handleClick(model, e), '', url.pathname + url.search, '.margin0', '');
    return h('.flex-row.appearance.w-100.m1.justify-between', [
        button1,
        h('.microBtnContainer.dropdown', {id: "dropdown-" + url, name: 'section-object-dropdown'}, [
            h('svg.icon', {fill: "currentcolor", viewBox: "0 0 8 8",
                onmouseenter: () => {
                    document.getElementById("dropdown-" + url).classList.toggle('dropdown-open');
                },
                onmouseleave: () => {
                    setTimeout( () => {
                        if (!document.getElementById("dropdown-" + url).classList.contains('dropdown-opened'))
                            document.getElementById("dropdown-" + url).classList.remove('dropdown-open');
                    }, 100);
                }
            },
                h('path', {d: "M0 2l4 4 4-4h-8z", name:"caret-bottom"})),
            h('.dropdown-menu', {
                onmouseenter: () => {
                    document.getElementById("dropdown-" + url).classList.toggle('dropdown-opened');
                },
                onmouseleave: () => {
                    document.getElementById("dropdown-" + url).classList.remove('dropdown-open');
                    document.getElementById("dropdown-" + url).classList.remove('dropdown-opened');
                }
            },[
                h('a.microBtn', {
                    onclick: () => {
                        model.router.go('/home/?page=home'); // TODO
                        model.fetchedData.delete(pageName, index);
                        model.notify();
                    }
                }, 'X'),
                h('a.microBtn', {
                    onclick: () => {
                        page[index].fetch();
                    }
                }, 'R'),
                h('a.microBtn', {
                    onclick: () => {
                        navigator.clipboard.writeText(url.toString())
                            .then(r => {
                                console.log(url + "was copied to clipboard")
                            })
                            .catch(e => {
                                console.error(e)
                            });
                    }
                }, 'C')
            ])]
        )
    ]);
}

export default function fetchedDataSection(model, pageName, label) {
    const page = model.fetchedData[pageName]
    const buttons = [];
    if (pageName !== null) {
        for (var index in page) {
            if (page.hasOwnProperty(index) && page[index] !== undefined && page[index] !== null) {
                buttons.push(multiButtonController(model, pageName, index));
            }
        }
    }

    return h('.flex-wrap.item-center.justify-center', [
        sectionTitle(label),
        h('.flex-column', buttons)
    ]);
}