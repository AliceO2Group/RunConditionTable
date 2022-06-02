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

import { h, iconLayers } from '/js/src/index.js';
import { RCT } from '../../../config.js';
const { dataReqParams } = RCT;

function defaultHref(page, index) {
	return `/?page=${page}${index ? `&${index}` : ''}&${
		dataReqParams.rowsOnSite
	}=50&${dataReqParams.site}=1`;
}

export default function alonePageButton(model, title, page, index = null) {
	const currentPointer = model.getCurrentDataPointer();
	const currentPage = currentPointer.page;

	const remoteData = model.getRemoteData(page, index);
	const data = remoteData.payload;

	const dataHref = remoteData.match({
		NotAsked: () => {
			throw 'fatal';
		},
		Loading: () => data.url.href,
		Success: () => data.url.href,
		Failure: (status) => {
			alert('error with url: ', data.url, status);
			defaultHref(page, index);
		},
	});

	return [
		h(
			'.menu-title',
			{
				class: currentPage === page ? 'currentMenuItem' : '',
			},
			title
		),
		h(
			'a.menu-item',
			{
				title: title,
				style: 'display:flex',
				href: dataHref,
				onclick: (e) => model.router.handleLinkEvent(e),
				class: currentPage === page ? 'selected' : '',
			},
			[h('span', iconLayers(), ' ', title)]
		),
	];
}
