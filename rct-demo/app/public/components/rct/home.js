import {h} from '/js/src/index.js';
import container from "../common/container.js";
import {range} from "../../utils/utils.js";
import spinner from "../spinner.js";


export default function home(model) {
    return h('.flex-wrap.justify-center', [h('h.title', 'welcome :)')].concat(range(0, 20).map(() => spinner())));
}