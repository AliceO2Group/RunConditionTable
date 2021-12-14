import {h, iconPin, iconEllipses, iconShareBoxed, iconReload, iconTrash} from '/js/src/index.js'

function multiButtonController(model, sectionName, index) {
    const section = model.fetchedData[sectionName];
    const url = section[index].payload.url;
    const dropdownID = "dropdown-" + url;

    const mainButton = h('a.menu-item', {
        style: 'display:flex',
        href: url.pathname + url.search,
        onclick: (e) => model.router.handleLinkEvent(e),
        class: model.router.params.index === index ? 'myActiveButton' : ''
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
        h('.dropdown', {id: dropdownID, name: 'section-object-dropdown'}, [
            
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
                        model.router.go('/home/?section=home'); // TODO
                        model.fetchedData.delete(sectionName, index);
                        model.notify();
                    }
                }, iconTrash()), // close
                h('a.menu-item', {
                    onclick: () => {
                        section[index].fetch();
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


export default function fetchedDataSection(model, sectionName, label) {
    const section = model.fetchedData[sectionName]
    const buttons = [];
    if (sectionName !== null) {
        for (let index in section) {
            if (section.hasOwnProperty(index) && section[index] !== undefined && section[index] !== null) {
                buttons.push(multiButtonController(model, sectionName, index));
            }
        }
    }

    // console.log(`${sectionName === model.router.params.section}: ${sectionName}`);

    return h('.flex-wrap', [
        h('.sectionTitle', {class: model.router.params.section === sectionName ? 'currentMenuItem' : ''}, label),
        h('.flex-wrap.item-center.justify-center', [
            h('.flex-column', buttons)
        ])
    ]);
}