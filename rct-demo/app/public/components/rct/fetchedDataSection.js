import viewButton from "../common/viewButton.js";
import {h} from '/js/src/index.js'
import handleClick from "../../utils/handleClick.js";

function sectionTitle(label) {
    return h('.sectionTitle', label)
}

function multiButtonController(model, sectionName, index) {
    const section = model.fetchedData[sectionName]
    const url = section[index].url;
    const dropdownID = "dropdown-" + url;
    const button1 = viewButton(model, index, (e) => handleClick(model, e), '', url.pathname + url.search, '.margin0', '');
    return h('.flex-row.appearance.w-100.m1.justify-between', [
        button1,
        h('.microBtnContainer.dropdown', {id: dropdownID, name: 'section-object-dropdown'}, [
            h('svg.icon', {fill: "currentcolor", viewBox: "0 0 8 8",
                onmouseenter: () => {
                    document.getElementById(dropdownID).classList.toggle('dropdown-open');
                },
                onmouseleave: () => {
                    setTimeout( () => {
                        if (!document.getElementById(dropdownID).classList.contains('dropdown-opened'))
                            document.getElementById(dropdownID).classList.remove('dropdown-open');
                    }, 100);
                }
            },
                h('path', {d: "M0 2l4 4 4-4h-8z", name:"caret-bottom"})),
            h('.dropdown-menu', {
                onmouseenter: () => {
                    document.getElementById(dropdownID).classList.toggle('dropdown-opened');
                },
                onmouseleave: () => {
                    document.getElementById(dropdownID).classList.remove('dropdown-open');
                    document.getElementById(dropdownID).classList.remove('dropdown-opened');
                }
            },[
                h('a.microBtn', {
                    onclick: () => {
                        model.router.go('/home/?section=home'); // TODO
                        model.fetchedData.delete(sectionName, index);
                        model.notify();
                    }
                }, 'X'),
                h('a.microBtn', {
                    onclick: () => {
                        section[index].fetch();
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

    return h('.flex-wrap.item-center.justify-center', [
        sectionTitle(label),
        h('.flex-column', buttons)
    ]);
}