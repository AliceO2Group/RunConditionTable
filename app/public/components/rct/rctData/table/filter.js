import { h } from '/js/src/index.js';

export default function filter(model) {
    const params = model.router.params;
    const data = model.fetchedData[params.page][params.index].payload;
    const fields = data.fields;

    return h('table.table-filters', [
        h('tbody', [
            labelsRow(model, fields),
            matchOrLowerBoundsInputs(fields),
            excludeOrUpperBoundsInputs(fields),
        ])
    ]);
}

const labelsRow = (model, fields) => {
    return h('tr', [
        h('.btn-group.w-50',
            h('td', [describingField('filter input type')]
                .concat(fields.map((field) => createClickableLabel(model, field))))
        )
    ])
}
const matchOrLowerBoundsInputs = (fields) => {
    return h('tr', [
        h('td', [describingField('match or lower bound')]
            .concat(fields.map((field) => createInputField(field, 'match'))))
    ]);
}
const excludeOrUpperBoundsInputs = (fields) => {
    return h('tr', [
        h('td', [describingField('exclude or upper bound')]
            .concat(fields.map((field) => createInputField(field, 'exclude'))))
    ])
}

const describingField = (name) => h('td', h('.container', {
    style: 'width:120px',
}, name));

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