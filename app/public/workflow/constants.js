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

const PREFIX = {
    SSO_DET_ROLE: 'det-',
};

const ROLES = Object.freeze({
    Admin: 'admin',
    Global: 'global',
    DetectorCPV: 'det-cpv',
    DetectorEMC: 'det-emc',
    DetectorFFD: 'det-fdd',
    DetectorFT0: 'det-ft0',
    DetectorFV0: 'det-fv0',
    DetectorGLO: 'det-glo',
    DetectorHMP: 'det-hmp',
    DetectorITS: 'det-its',
    DetectorMCH: 'det-mch',
    DetectorMFT: 'det-mft',
    DetectorMID: 'det-mid',
    DetectorPHS: 'det-phs',
    DetectorTOF: 'det-tof',
    DetectorTPC: 'det-tpc',
    DetectorTRD: 'det-trd',
    DetectorZDC: 'det-zdc',
    Guest: 'guest',
});

export { PREFIX, ROLES };
