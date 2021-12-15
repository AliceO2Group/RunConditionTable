import inputForm from '../../../common/inputForm.js';
import { h } from '/js/src/index.js';
import viewButton from '../../../common/viewButton.js';

const createClickableLabel = (model, field) => h('td', h('button.btn.filterLabel', {
    style: 'width:120px',
    onclick: () => model.fetchedData.changeItemStatus(field),
    className: field.marked ? 'active' : ''
}, field.name));

const createInputField = (field, command) => h('td', h('input.form-control', {
    style: 'width:120px',
    type: 'text',
    placeholder: '',
  }));

export default function filter(model) {
    const params = model.router.params;
    const data = model.fetchedData[params.section][params.index].payload;
    const fields = data.fields;

    return h('table.table-filters', [
        h('tbody', [
          h('tr', [
              h('.btn-group.w-50',
                h('td', fields.map((field) => createClickableLabel(model, field)))
            )
          ]),
            
          h('tr', [
              h('td', fields.map((field) => createInputField(field, 'match')))
          ]),
          h('tr', [
            h('td', fields.map((field) => createInputField(field, 'exclude')))
        ]),
      ])
    ]);
}