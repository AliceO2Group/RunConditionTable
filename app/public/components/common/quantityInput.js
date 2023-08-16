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

export default function quantityInput(id, defaultQuantity) {
    function handleInput(e) {
        e.preventDefault();
        if (e.key === '1'
            || e.key === '2'
            || e.key === '3'
            || e.key === '4'
            || e.key === '5'
            || e.key === '6'
            || e.key === '7'
            || e.key === '8'
            || e.key === '9'
            || e.key === '0'
            || e.key === 'Backspace') {
            document.getElementById(id).value = document.getElementById(id).value + e.key;
        }

        if (e.key === 'Enter') {
            changeQuantity(0);
        }
    }

    const inputComponent = h('input', {
        id: id,
        value: defaultQuantity,
        placeholder: defaultQuantity,
        type: 'number',
        pattern: '[0-9]+',
        onkeydown: (e) => handleInput(e),
    });

    const changeQuantity = (change) => {
        let quantity = Number(document.getElementById(id).value);
        if (isNaN(quantity)) {
            quantity = defaultQuantity;
        }
        quantity += change;
        quantity = Math.max(quantity, 1);
        document.getElementById(id).value = quantity;
    };

    const increaseButton = h('button.btn.btn-secondary', {
        onclick: () => {
            changeQuantity(1);
        },
    }, '+');

    const decreaseButton = h('button.btn.btn-secondary', {
        onclick: () => {
            changeQuantity(-1);
        },
    }, '-');

    return h('.quantity-input.flex-wrap.items-center.justify-between',
        decreaseButton,
        inputComponent,
        increaseButton);
}
