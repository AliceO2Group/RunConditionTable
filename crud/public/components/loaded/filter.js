import { h } from '/js/src/index.js';
import button from '../common/button.js';

function handleClear(e, model) {
    e.preventDefault();

    document.getElementById('filterID').value = "";
    document.getElementById('filterValue').value = "";
    document.getElementById('filterYear').value = "";
    document.getElementById('filterMonth').value = "";
    document.getElementById('filterDay').value = "";

    model.getData()
}

function handleFilter(e, model) {
    e.preventDefault();

    const id = document.getElementById('filterID').value;
    const value = document.getElementById('filterValue').value;
    const year = document.getElementById('filterYear').value;
    const month = document.getElementById('filterMonth').value;
    const day = document.getElementById('filterDay').value;

    model.filter(id, value, year, month, day);
}

export default function filter(model) {
        return h('div', {id: 'filterForm'}, [
                h('label', {for: "filterID"}, 'ID: '),
                h('input', {type: "text", name: "filterID", id: 'filterID'}),
                h('label', {for: "filterValue"}, 'Value: '),
                h('input', {type: "text", name: "filterValue", id: 'filterValue'}),
                h('label', {for: "filterYear"}, 'Year: '),
                h('input', {type: "text", name: "filterYear", id: 'filterYear'}),
                h('label', {for: "filterMonth"}, 'Month: '),
                h('input', {type: "text", name: "filterYear", id: 'filterMonth'}),
                h('label', {for: "filterDay"}, 'Day: '),
                h('input', {type: "text", name: "filterDay", id: 'filterDay'}),
            button('Filter', (e) => handleFilter(e, model)),
            button('Clear', (e) => handleClear(e, model)),
        ]
    );
}