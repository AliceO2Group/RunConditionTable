import { h } from '/js/src/index.js';

export default function spinner() {
    return h('div.topSpace',
        h('div.center',
            h('div.atom-spinner.f1',
                h('div.spinner-inner',
                    h('div.spinner-line'),
                    h('div.spinner-line'),
                    h('div.spinner-line'),
                    h('div.spinner-circle', '●'),
                ),
            ),
        ),
        h('h5', 'Loading...'),
    );
}
