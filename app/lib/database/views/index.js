

const periods_view = require('./periods_view.js');
const {runs_per_period_view, runs_per_data_pass_view} = require('./runs_views.js');
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
    flags_view
}