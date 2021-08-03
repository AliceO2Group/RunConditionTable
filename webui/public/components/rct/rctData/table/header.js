import { h } from '/js/src/index.js';

export default function tableHeader(visibleFields, data, checkBoxFunction) {
    return h('tr',
                visibleFields.map(f => {
                    return h('th', {scope: 'col'}, f.name)
                }).concat([
                h('th', {scope: "col"},
                    h('.form-check.mv2', [
                        h('input.form-check-input', {
                            type: 'checkbox',
                            id: 'hide-marked',
                            onclick: checkBoxFunction
                        }, ''),
                        h('label.form-check-label', {for: 'hide-marked'}, 'Hide marked')
                    ])
                )
            ]))
}
