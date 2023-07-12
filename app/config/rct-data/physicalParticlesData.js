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

const physicalParticlesData = {
    p: {
        full_name: 'proton',
        Z: 1,
        A: 1,
    },
    Pb: {
        full_name: 'lead',
        Z: 83,
        A: 207,
    },
    O: {
        full_name: 'oxygen',
        A: 8,
        Z: 16,
    },
    Xe: {
        full_name: 'xenon',
        A: 54,
        Z: 131,
    },
};

module.exports = physicalParticlesData;
