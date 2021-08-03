import { h } from '/js/src/index.js';
import { serialIf } from '../../../../utils/utils.js';

//TODO <need?> some method for providing id for marking buttons;
export default function row(model, visibleFields, data, item, cellsButtons) {
    return h(serialIf(
                    'tr',
                    ['.bg-grey', '.d-none'],
                    ['.bg-warning', ''],
                    [!item.marked, data.hideMarkedRecords && item.marked]
                ), visibleFields.map(f => {
                        const n = f.name;
                        if (item.hasOwnProperty(n)) {
                            if (cellsButtons.hasOwnProperty(n))
                                return h('td', cellsButtons[n](model, item, n));
                            else
                                return h('td', item[n])
                        } else {
                            return h('td', n + '__tmp_');
                        }
                    }).concat([
                    h('td', h('input.form-check-input.p1.mh4.justify-center.relative', {
                        style: 'margin-left=0',
                        type: 'checkbox',
                        id: 'record-mark',
                        onclick: (e) => data.changeItemStatus(item)
                    }))

                ]))
}
