/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

 // const RunConditionTableApplication = require('../app/application.js');
 const DatabaseSuite = require('./database');
 const PublicSuite = require('./public');
 const LibSuite = require('./lib');
 const assert = require('assert');

 /*after(() => {
    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGINT');
  })
*/

 describe('Run Condition Table', () => {
    const Application = require('../app/application.js');
    // const application = new Application({});
    
    /*
    before(async () => {
        await application.run();
    });

    after(async () => {
        await application.stop(true);
    });
*/
    describe('Unit Suite', () => {
        describe('Database', DatabaseSuite);
        describe('Public', PublicSuite);
        describe('Lib', LibSuite);
    });
    
    describe('App initialization', () => {
        it('should initialize the app instance', () => {
            assert.doesNotThrow(() => {
                new Application({});
            });
        });
    });
});
/*
describe('Signal handling', () => {
    // const handlerFunction = runConditionTableApplication.stop.bind(runConditionTableApplication));
    const runConditionTableApplication = new RunConditionTableApplication({});
    runConditionTableApplication.run();
    [ 'SIGTERM', 'SIGINT' ].forEach(SIGNAL => {
  
      describe(`${ SIGNAL }`, () => {
        let sandbox, closeStub, exitStub;
  
        beforeEach(() => {
          sandbox   = sinon.sandbox.create({ useFakeTimers : true });
          closeStub = sandbox.stub(runConditionTableApplication, 'close');
          exitStub  = sandbox.stub(process, 'exit');
        })
  
        afterEach(() => {
          sandbox.restore();
        })
  
        it(`should call 'app.close()' when receiving a ${ SIGNAL }`, done => {
          process.once(SIGNAL, () => {
            sinon.assert.calledOnce(closeStub);
            done();
          });
          process.kill(process.pid, SIGNAL);
        })
      })
  
    })
  
  })
*/