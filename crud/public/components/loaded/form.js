import { h } from '/js/src/index.js';
import button from '../common/button.js';

export default function form(formID, buttonLabel, onClickAction, valueID, dateID) {
    return h('form', {id: formID},
        h('div.input',
            h('label', {for: "value"}, 'Value: '),
            h('input', {type: "text", name: "value", id: valueID}),
        ),
        h('div.input',
            h('label', {for: "date"}, 'Date: '),
            h('input', {type: "text", name: "date", id: dateID}),
        ),
        button(buttonLabel, onClickAction),
    );
}
