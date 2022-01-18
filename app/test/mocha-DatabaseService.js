const DatabaseService = require('../lib/DatabaseService.js');
const assert = require('assert');
const sinon = require('sinon');
const {Log} = require("@aliceo2/web-ui");

describe('DatabaseService test suite', function() {
    describe('Check Initialization of DatabaseService', function() {
        it('should successfully initialize the DatabaseService', function() {
            assert.doesNotThrow(() => {
                new DatabaseService({}, new Log('Tutorial'));
            });
        });
    });

    describe('ApplicationService getData test suite', function() {
        it('should successfully send data about the project', function() {
            const databaseService = new DatabaseService({}, new Log(''));
            res = {
                status: sinon.fake.returns(),
            };
            const data = '';
            databaseService.getDate(null, res);
            console.log(res);
            // assert.ok(res.status.calledWith(200));
            // assert.ok(res.json.calledWith(data));
            // assert.ok(res.)
        });
    });
});