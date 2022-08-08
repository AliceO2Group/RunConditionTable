/**
 *
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

const services = {
    bookkeeping: {
        url: {
            rct: 'http://rct-bookkeeping.cern.ch:4000/api/runs',
            ali: 'https://ali-bookkeeping.cern.ch/api/runs',
        },
    },
    monalisa: {
        url: {
            dataPassesRaw: 'https://alimonitor.cern.ch/production/raw.jsp?res_path=json',
            dataPassesDetailed: 'https://alimonitor.cern.ch/production/raw_details.jsp?timesel=0&res_path=json',

            mcRaw: 'https://alimonitor.cern.ch/MC/?res_path=json',
            mcDetailed: 'https://alimonitor.cern.ch/job_events.jsp?timesel=0&owner=aliprod&res_path=json',
        },
    },
};

class ServicesEnpointsFormatter {
    static bookkeeping(page, limit) {
        return `${services.bookkeeping.ali}/?page[offset]=${page * limit}&page[limit]=${limit}`;
    }

    static dataPassesRaw() {
        return services.monalisa.url;
    }

    static dataPassesDetailed(description) {
        return `${services.monalisa.url.dataPassesDetailed}&filter_jobtype=${encodeURI(description)}`;
    }
}

module.exports = ServicesEnpointsFormatter;

// eslint-disable-next-line max-len
//E rawDataDetalied: 'https://alimonitor.cern.ch/production/raw_details.jsp?timesel=0&filter_jobtype=OCT+-+async+production+for+pilot+beam+pass+3%2C+O2-2763&res_path=json',
// eslint-disable-next-line max-len
//E mcRawDataDetailed: 'https://alimonitor.cern.ch/job_events.jsp?timesel=0&owner=aliprod&filter_jobtype=Pb-Pb%2C+5.02+TeV+-+HIJING+%2B+nuclei+Geant4+with+modified+material+budget+%2B4.5%+(Pb-Pb+Pass3)%2C+50-90%+centrality%2C+ALIROOT-8784&res_path=json',
