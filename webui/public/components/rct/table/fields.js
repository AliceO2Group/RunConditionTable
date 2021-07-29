import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../../utils/utils.js';
import button from '../../common/button.js';

export default function fields(model, colNames, data, buttonsFunctions) {
    return [h('tr', colNames.map(item => {
        return h('th', item);
    }))]
}