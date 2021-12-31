import {h, iconPin, iconEllipses, iconShareBoxed, iconReload, iconTrash} from '/js/src/index.js'

function multiButtonController(model, pageName, index) {
    const page = model.fetchedData[pageName];
    const url = page[index].payload.url;
    const dropdownID = "dropdown-" + url;

    const mainButton = h('a.menu-item', {
        style: 'display:flex',
        href: url.pathname + url.search,
        onclick: (e) => model.router.handleLinkEvent(e),
        class: model.router.getUrl().href === url.href ? 'myActiveButton' : ''
    }, [
        h('span', iconPin(), ' ', index),
        h('span.ph2', {
            onmouseenter: () => {
                document.getElementById(dropdownID).classList.toggle('dropdown-open');
            },
            onmouseleave: () => {
                setTimeout( () => {
                    if (!document.getElementById(dropdownID).classList.contains('dropdown-opened'))
                        document.getElementById(dropdownID).classList.remove('dropdown-open');
                }, 100);
            },
            class: model.router.params.index === index ? 'gray-darker' : 'gray'
        },
        iconEllipses()),
    ]);

    return h('.flex-row.appearance.w-100.m1.justify-between', [
        mainButton,
        h('.dropdown', {id: dropdownID, name: 'page-object-dropdown'}, [

            h('.dropdown-menu', {
                onmouseenter: () => {
                    document.getElementById(dropdownID).classList.toggle('dropdown-opened');
                },
                onmouseleave: () => {
                    document.getElementById(dropdownID).classList.remove('dropdown-open');
                    document.getElementById(dropdownID).classList.remove('dropdown-opened');
                }
            },[
                h('a.menu-item', {
                    onclick: () => {
                        model.router.go('/home/?page=home'); // TODO
                        model.fetchedData.delete(pageName, index);
                        model.notify();
                    }
                }, iconTrash()), // close
                h('a.menu-item', {
                    onclick: () => {
                        // TODO
                        // model.fetchedData.req(true, page[index].url)
                        // page[index].fetch();
                    }
                }, iconReload()), // reload
                h('a.menu-item', {
                    onclick: () => {
                        navigator.clipboard.writeText(url.toString())
                            .then(r => {
                                console.log(url + "was copied to clipboard")
                            })
                            .catch(e => {
                                console.error(e)
                            });
                    }
                }, iconShareBoxed()) // copy
            ])]
        )
    ]);
}


export default function fetchedDataPage(model, pageName, label) {
    const page = model.fetchedData[pageName]
    const buttons = [];
    if (pageName !== null) {
        for (let index in page) {
            if (page.hasOwnProperty(index) && page[index]) {
                buttons.push(multiButtonController(model, pageName, index));
            }
        }
    }


    return h('.flex-wrap', [
        h('.pageTitle', {class: model.router.params.page === pageName ? 'currentMenuItem' : ''}, label),
        h('.flex-wrap.item-center.justify-center', [
            h('.flex-column', buttons)
        ])
    ]);
}