import { h } from '/js/src/index.js';
import filter from './filter.js';
import row from './datarow.js';
import form from './form.js';

function handleInsert(e, model) {
    e.preventDefault();

    const value = document.getElementById('value').value;
    const date = document.getElementById('date').value;

    model.insert(value, date);
    document.getElementById('insert-form').reset();
}

export default function loadedView(model) {
    const header = h('thead',
            h('tr',
                h('th', 'id'),
                h('th', 'value'),
                h('th', 'date'),
                h('th', 'delete'),
                h('th', 'update')
            )
    );

    return h('div.center',
        h('div.sidebar', 
            form('insert-form', 'Insert data', (e) => handleInsert(e, model), "value", "date"),
            h('hr'),
            h('hr'),
            h('hr'),
            filter(model),
        ),
        h('table',
            header,
            model.data.length > 0 ? h('tbody', model.data.map(item => row(model, item))) : 'no matching items were found',
        )
    );
}
