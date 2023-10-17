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

const periods_view = require('./periods_view.js');
const { runs_per_period_view, runs_per_data_pass_view } = require('./runs_views.js');
const data_passes_view = require('./data_passes_view.js');
const mc_view = require('./mc_view.js');
const anchored_per_mc_view = require('./anchored_per_mc_view.js');
const anchorage_per_data_pass_view = require('./anchorage_per_data_pass_view.js');
const flags_view = require('./flags_view.js');

module.exports = {
    periods_view,
    runs_per_data_pass_view,
    runs_per_period_view,
    data_passes_view,
    mc_view,
    anchored_per_mc_view,
    anchorage_per_data_pass_view,
    flags_view,
};
