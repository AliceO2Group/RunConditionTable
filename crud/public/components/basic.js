import button from './common/button.js';
import { h } from '/js/src/index.js';

function handleLoad(e, model) {
    e.preventDefault();
    model.getData();
}

export default function basic(model) {
    return h('div',
        h('div.blanchedFrame',
            h('acronym', { title: 'Create Read Update Delete'}, h('h1', 'CRUD')),
            h('h3', 'Tutorial'),
            h('h4', 'PostgreSQL JavaScript node.js WebUI'),
        ),
        h('div.center',
            button('Load data', (e) => handleLoad(e, model)),
        ),
    );
}
