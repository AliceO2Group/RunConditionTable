import inputForm from '../../../common/inputForm.js';
import { h } from '/js/src/index.js';
import viewButton from '../../../common/viewButton.js';

async function handleFilter(model) {
    const idWanted = document.getElementById('idWanted').value;
    const yearWanted = document.getElementById('yearWanted').value;
    const periodWanted = document.getElementById('periodWanted').value;
    const beamWanted = document.getElementById('beamWanted').value;
    const energyWanted = document.getElementById('energyWanted').value;
    const bFieldWanted = document.getElementById('bFieldWanted').value;
    const statisticsWanted = document.getElementById('statisticsWanted').value;

    const res = await model.filter(idWanted, yearWanted, periodWanted, beamWanted, energyWanted, bFieldWanted, statisticsWanted);
    console.log("filter executed!");
}

export default function filter(exec){//model){//exec) {
    return h('tr', [
                //h('th', {scope: "col"}, inputForm('id', 'idWanted', 'search'),),
                //h('th', {scope: "col"}, inputForm('year', 'yearWanted', 'search'),),
                //h('th', {scope: "col"}, inputForm('period', 'periodWanted', 'search'),),
                //h('th', {scope: "col"}, inputForm('beam', 'beamWanted', 'search'),),
                //h('th', {scope: "col"}, inputForm('energy', 'energyWanted', 'search'),),
                h('th', {scope: "col"}, inputForm('b field', 'bFieldWanted', 'search'),),
                h('th', {scope: "col"}, inputForm('statistics', 'statisticsWanted', 'search'),),
                //h('th', {scope: "col"}, button('Search', handleFilter(model), ''),),
                h('th', {scope: "col"}, viewButton('Search', exec, ''),),
            ])
}