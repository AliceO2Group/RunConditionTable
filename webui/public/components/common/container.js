import { h } from '/js/src/index.js';

export default function container(...options) {
    return h('.flex-wrap.justify-center',
        h('div', [
            options
        ])
    );
}
