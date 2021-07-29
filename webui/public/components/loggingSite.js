import { h } from '/js/src/index.js';
import sessionService from '/js/src/sessionService.js';
import inputForm from './common/inputForm.js';
import button from './common/button.js';
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
    console.log("Logged in successfully!");
    console.log(`sessionService: ${sessionService}`);
}

export default function loggingSite(model) {
    const loginButton = button("login", () => handleLogin(model));
    const registerButton = button("register", handleRegistration);
    const title = h('h1.primary', 'TEST APP');
    
    return h('div.loginDiv',
        h('div.loginDivInside', [
            title,

            container(
                inputForm("dbname", "dbname", "rct-db"),
                inputForm("username", "username", "username"),
                inputForm("password", "password", "password", true),),

            container(loginButton, registerButton),
        ])
    )
}
