import { h } from '/js/src/index.js';
import { parseMonth } from '../../utils/dateHelper.js';
import button from '../common/button.js';
import form from './form.js';

function handleUpdate(e, model, item) {
    e.preventDefault();

    let value = document.getElementById('valueUpdate').value;
    let date = document.getElementById('dateUpdate').value;

    if(value == "") value = item.value.toString();
    if(date == "") {
        const jsDate = new Date(item.date.toString());
        date = `${jsDate.getFullYear()}-${parseMonth(jsDate.getMonth())}-${jsDate.getDate()}`;
    }

    model.update(item.id, value, date);
    document.getElementById('update-form').reset();
}

function handleVisible(e, model, item) {
    e.preventDefault();
    model.updateVisibility(item);
}

function handleDelete(e, model, item) {
    e.preventDefault();
    model.delete(item.id);
}

export default function row(model, item) {
    const date = new Date(item.date.toString()).toDateString();
    return [
        h('tr', [
            h('td', item.id),
            h('td', item.value),
            h('td', date),
            h('td', button("X", (e) => handleDelete(e, model, item))),
            h('td', button('Update', (e) => handleVisible(e, model, item))),
        ]),
        item.isDropdownVisible ? h('tr', {colspan: "4"}, h('div', form('update-form', 'Update', (e) => handleUpdate(e, model, item), 'valueUpdate', 'dateUpdate'))) : '',
    ];
}
