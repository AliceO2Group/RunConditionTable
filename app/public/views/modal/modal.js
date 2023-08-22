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

import { h } from '/js/src/index.js';
import pageSettings from '../userView/data/pageSettings/pageSettings.js';
import about from '../../components/about/about.js';
import detectorSettings from '../userView/data/detectorSettings/detectorSettings.js';
import periodsExport from '../periods/overview/periodsExport.js';

export const modalClassNames = {
    modal: 'modal',
    content: 'modal-content',
};

export const modalIds = {
    pageSettings: {
        modal: 'pageSettingsModalId',
        content: 'pageSettingsModalContentId',
    },
    about: {
        modal: 'aboutModalId',
        content: 'aboutModalContentId',
    },
    detectors: {
        modal: 'detectorSettingsModalId',
        content: 'detectorSettingsContentId',
    },
    dataExport: {
        modal: 'dataExportModalId',
        content: 'dataExportContentId',
    },
};

const allModals = () => ({
    modals: document.getElementsByClassName(modalClassNames.modal),
    contents: document.getElementsByClassName(modalClassNames.content),
});

export const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.addEventListener('click', (event) => {
            const { modals, contents } = allModals();
            if (Array.from(contents).find((e) => e != event.target)
                && Array.from(modals).find((e) => e == event.target)
                && document.getElementById(modalId)) {
                document.getElementById(modalId).style.display = 'none';
            }
        });
    } else {
        alert(`${modalId} not found!`);
    }
};

export const modal = (modalId, dataModel = null, model = null) => {
    switch (modalId) {
        case modalIds.pageSettings.modal: {
            return model
                ? h(`.${modalClassNames.modal}`, { id: modalIds.pageSettings.modal },
                    h(`.${modalClassNames.content}.abs-center.p3`, {
                        id: modalIds.pageSettings.content,
                    }, pageSettings(model.parent.userPreferences, () => {
                        document.getElementById(modalIds.pageSettings.modal).style.display = 'none';
                    })))
                : '';
        }
        case modalIds.about.modal: {
            return h(`.${modalClassNames.modal}`, { id: modalIds.about.modal },
                h(`.${modalClassNames.content}.abs-center.p3`, {
                    id: modalIds.about.content,
                }, about()));
        }
        case modalIds.detectors.modal: {
            return h(`.${modalClassNames.modal}`, { id: modalIds.detectors.modal },
                h(`.${modalClassNames.content}.abs-center.p3`, {
                    id: modalIds.detectors.content,
                }, detectorSettings(model.parent.userPreferences)));
        }
        case modalIds.dataExport.modal: {
            return h(`.${modalClassNames.modal}`, { id: modalIds.dataExport.modal },
                h(`.${modalClassNames.content}.abs-center.p3`, {
                    id: modalIds.dataExport.content,
                }, periodsExport(model.parent.userPreferences, () => {
                    document.getElementById(modalIds.dataExport.modal).style.display = 'none';
                }, dataModel)));
        }
    }
};
