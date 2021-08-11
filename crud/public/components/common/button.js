import { h } from '/js/src/index.js';

export default function button(label, onClickAction) {
    return h('div.fancyButton', {onclick: onClickAction},
        h('a', h('span', label))
    );
}
