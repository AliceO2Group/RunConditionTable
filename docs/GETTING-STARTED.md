
## Running the application

Most tasks are wrappers for `rctmake`.

#### Npm tasks desciption
Npm tasks are run via 
```bash
npm run <TASK> -- RCTMAKE_ADDITIONAL_ARGUMENTS
```
#### Within docker:
1. `dev` - main task for running application in dev mode, see `rctmake` help, The task prune, build and run containers, one for the database and one for the application. Changes in the local repo force the application restart on docker (see nodemon and the `start:dev` script, see also `rctmake` option `--target-modifier`). You can run multiple instances of application in dev mode simultaneously, see `rctmake` option `--subtarget`.
2. other `*dev*` tasks are modification of pervious one
#### Starting locally:
 1. `start:dev:local` - run the RCT application locally, by default it fetches env vars from `<ProjectDir>/docker/dev.env` with exception that `RCT_DB_HOST` env var is substituted to localhost. If you want to make other substitutions, specify them as follows (bash) before the aplication start: `(export FOO=bar; npm run start:dev:local)`
 2. `deploy:db:local` - deploy the database locally with the use of `<ProjectDir>/database/setup-db.sh` script. It uses the same env as the upper task and follows the same env vars substitution logic.

#### Testing
15. `test` - main task for testing purpose, run static analysis and codecov on docker containers, results are available in `<ProjectDir>/reports/`
13. `eslint` - static analysis, results in `<ProjectDir>/reports/static/static-analyzis.html`
14. `reports:show` - open reports, static analysis and codecov in browser


#### Database dumps managing, dumps are stored in `<ProjectDir>/database/cache/dumps`
see `rctmake` help


### Using grid certificates
Grid certificates need to be located in `<ProjectDir>/security/`. The certificate used by the application has to be named (TMP *TODO filename convention*) `rct-alimonitor-cert.p12`. It is also required to set `ALIMONITOR_PASSPHRASE` env var which holds the passphrase to that certificate.

### Reaching CERN network
1. Default behaviour of the application running on docker (var `RUNNING_ENV` is set to `DOCKER`) is to use ssh proxy `socks://172.200.200.1:12345` opened on a host, so you need to locally open ssh socket via command:
```bash
ssh -D 172.200.200.1:12345 <user>@<host>
```
or using script which opens defualt proxy (the same as above one)
```bash
./scripts/dev-sshopen.sh <USER>
```

2. If you want to use proxy other than default (because  e.g. the application is <b>NOT</b> running on docker) you need to specify the socket you are going to use on your own. First open the socket via ssh:
```bash
ssh -D localhost:12345 <user>@<host>
```
then save the address of the socket you've opened in `CERN_SOCKS` env var e.g. 
```bash
export CERN_SOCKS='socks://localhost:12345'
```
3. If you want to use proxy set `CERN_SOCKS` to true:
```bash
export CERN_SOCKS='true'
```
