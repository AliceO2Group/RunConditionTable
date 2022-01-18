import { h } from '/js/src/index.js';
import inputForm from './common/inputForm.js';
import viewButton from './common/viewButton.js';
import container from './common/container.js';

function handleRegistration() {
    alert("Registration has not been implemented yet :(");
}

async function handleLogin(model) {
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const dbnameEl = document.getElementById('dbname');
    const dbname = dbnameEl.value === '' ? dbnameEl.placeholder : dbnameEl.value;

    const p = await model.login(username, password, dbname);
}

export default function loggingSite(model) {
    const loginButton = viewButton(model, "login", () => handleLogin(model));
    const registerButton = viewButton(model, "register", handleRegistration);
    const title = h('h1.primary', 'TEST APP');
    
    return h('div.loginDiv',
        h('div.loginDivInside', [
            title,

            container(
                inputForm("dbname", "dbname", "rct-db-v2"),
                inputForm("username", "username", "username"),
                inputForm("password", "password", "password", true),),
            container(loginButton, registerButton),
        ])
    )
}
