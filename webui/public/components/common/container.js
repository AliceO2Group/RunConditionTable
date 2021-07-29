import { h } from '/js/src/index.js';

export default function container(...options) {
    return h('container',
        h('div', [
            options
        ])
    );
}
