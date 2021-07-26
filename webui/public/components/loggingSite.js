import { h } from '/js/src/index.js';
import sessionService from '/js/src/sessionService.js';
import inputForm from './common/inputForm.js';
import button from './common/button.js';

export default function loggingSite(model) {
    const handleLogin = async e => {
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;
        const dbnameEl = document.getElementById('dbname');
        const dbname = dbnameEl.value === '' ? dbnameEl.placeholder : dbnameEl.value;

        const p = await model.login(username, password, dbname);
        console.log("Im. after logging,; sessionService: ");
        console.log(sessionService);
    }

    const handleRegistration = e => {
        alert("Registration has not been implemented yet :(");
    }
    
    return h('div.flex-column.items-center.justify-center',
        h('div.flex-column.bg-gray-lighter.br3.p4', [
            h('h1.primary', 'TEST APP'), ' ',
            
            h('form-group', 
                inputForm("dbname", "dbname", "rct-db"),
                inputForm("username", "username", "username"),
                inputForm("password", "password", "password", true),
            ),

            h('.flex-wrap.justify-center',
                h('div', [
                    h('.pv2', button("login", handleLogin)),
                    h('.pv2', button("register", handleRegistration))
                ])
            )
        ])
    )
}
