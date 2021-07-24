import { h } from '/js/src/index.js';
import sessionService from '/js/src/sessionService.js';

export default function loggingSite(model) {
    return h('div.flex-column.items-center.justify-center',
        h('div.flex-column.bg-gray-lighter.br3.p4', [
            h('h1.primary', 'TEST APP'), ' ',
            h('form', [
                h('label', {for: "dbname"}, ""),
                h('input', {id: "dbname", type: 'input', placeholder: "rct-db"}, '')
            ]),
            h('form', [
                h('label', {for: "username"}, ""),
                h('input', {id: "username", type: 'input', placeholder: "username"}, '')
            ]), ' ',
            h('form', [
                h('label', {for: "password"}, ""),
                h('input', {id: "password", type: 'password', placeholder: "password"}, '')
            ]),

            h('.flex-wrap.justify-center',
                h('div', [
                    h('.pv2', h('button.btn.justify-center.items-center', {
                        onclick: async e => {
                            const password = document.getElementById('password').value;
                            const username = document.getElementById('username').value;
                            const dbnameEl = document.getElementById('dbname');
                            const dbname = dbnameEl.value === '' ? dbnameEl.placeholder : dbnameEl.value;

                            const p = await model.login(username, password, dbname);
                            console.log("Im. after logging,; sessionService: ");
                            console.log(sessionService);
                        }
                    }, "login")),
                    h('.pv2', h('button.btn', {onclick: e => alert("(window.sessionService)TODO, now you are logged as: " + window.sesService)}, "register"))
                ])
            )
        ])
    )
}
