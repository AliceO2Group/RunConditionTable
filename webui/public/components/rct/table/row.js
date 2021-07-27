import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../../utils/utils.js';
import button from '../../common/button.js';

export default function row(model, item) {
    return h(goodBadOpt(
                    'tr',
                    ['.bg-grey', '.d-none'],
                    ['.bg-warning', ''],
                    [!item.marked, model.hideMarkedRecords && item.marked]
                ), [
                    h('td', item.id),
                    h('td', item.year),
                    h('td', button(item.period, () => alert('TODO'))),
                    h('td', item.beam),
                    h('td', item.energy),
                    h('td', 'b field'),
                    h('td', 'statistics'),

                    h('td', h('input.form-check-input.p1.mh4.justify-center.relative', {
                        style: 'margin-left=0',
                        type: 'checkbox',
                        id: 'record-mark',
                        onclick: (e) => model.changeItemStatus(item)
                    }))

                ])
}
