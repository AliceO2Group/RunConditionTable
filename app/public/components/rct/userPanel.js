import { h, switchCase } from '/js/src/index.js';
import { reduceSerialIf } from '../../utils/utils.js';
import header from '../common/header.js';
import __home from "./__home.js";
import rctDataView from "./rctData/rctDataView.js";
import sidebar from "./sidebar/sidebar.js";


/**
 * creates vnode containing sidebar used to change content and content
 * @param model
 * @returns {*}
 */
export default function userPanel(model) {
    const url = model.router.getUrl();
    return h('.flex-column.absolute-fill', [
        h('header.shadow-level2.level2', [
          header(model),
        ]),
        h('.flex-grow.flex-row.outline-gray', [
          sidebar(model),

          h('section.outline-gray.flex-grow.relative', [
            h('.scroll-y.absolute-fill.bg-white', {id: 'main-content'}, [
                url.pathname === '/Rct-Data/' ? rctDataView(model) : '', //__home(model),
            ])
          ]),
        ])
      ])
}
