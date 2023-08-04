/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

/**
 * @typedef Run
 *
 * @property {number} runNumber
 * @property {number|null} timeO2Start
 * @property {number|null} timeO2End
 * @property {number|null} timeTrgStart
 * @property {number|null} timeTrgEnd
 * @property {number|null} startTime timestamp of the run's start, either trigger start if it exists or o2 start or null
 * @property {number|null} endTime timestamp of the run's end, either trigger end if it exists or o2 end or now (always null if start is null)
 * @property {number|null} runDuration
 * @property {number|null} fillNumber
 * @property {number|null} lhcBeamEnergy
 * @property {number|null} l3CurrentVal
 * @property {number|null} dipoleCurrentVal
 * @property {DetectorSubsystem[]|null} detectorSubsystems
 */
