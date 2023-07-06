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

export default function flagsMockData(run_start, run_end) {
    function randomDate(from, to) {
        const d = Math.floor(from + Math.random() * (to - from));
        return new Date(d);
    }
    const radix = 10;
    const start1 = randomDate(parseInt(run_start, radix), parseInt(run_end, radix));
    const start2 = randomDate(start1.getTime(), parseInt(run_end, radix));
    const start3 = randomDate(start2.getTime(), parseInt(run_end, radix));
    const start4 = randomDate(start3.getTime(), parseInt(run_end, radix));

    return [
        {
            start: start1,
            end: randomDate(start1.getTime(), parseInt(run_end, radix)),
            flag: 'Limited Acceptance',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
        {
            start: start2,
            end: randomDate(start2.getTime(), parseInt(run_end, radix)),
            flag: 'Limited Acceptance',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
        {
            start: start3,
            end: randomDate(start3.getTime(), parseInt(run_end, radix)),
            flag: 'Limited Acceptance',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
        {
            start: start4,
            end: randomDate(start4.getTime(), parseInt(run_end, radix)),
            flag: 'Limited Acceptance',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
        {
            start: start4,
            end: randomDate(start4.getTime(), parseInt(run_end, radix)),
            flag: 'Wrong flag',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
        {
            start: start4,
            end: randomDate(start2.getTime(), parseInt(run_end, radix)),
            flag: 'Another wrong flag',
            comment: 'Software configuration was totally wrong',
            addedBy: 'John Smith',
            lastChange: {
                person: 'Alice Brown',
                time: randomDate(parseInt(run_start, radix), parseInt(run_end, radix)),
            },
        },
    ];
}
