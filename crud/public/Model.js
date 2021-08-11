import { Observable, fetchClient } from '/js/src/index.js';
import { sleep } from './utils/sleep.js';

export default class Model extends Observable {
    constructor() {
        super();
        this.data = null;
        this.loaded = false;
        this.spinner = false;
    }

    async getData() {
      this.data = [];
      const response = await fetchClient('/api/getData', {
          method: 'GET',
      });
      const content = await response.json().then(data => {
        for(const item of data.map(item => {item.isDropdownVisible = false; return item;})) {
          this.data.push(item);
        }
      });
      this.wait();
    }

    async delete(id) {
      const response = await fetchClient(`/api/delete/${id}`, {
        method: 'DELETE',
      });
      this.getData();
    }

    async insert(value, date) {
      const response = await fetchClient('/api/insert', {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({value: value, date: date}),
      });
      this.getData();
    }

    async update(id, value, date) {
      const response = await fetchClient(`/api/update/${id}`, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({value: value, date: date}),
      });
      this.getData();
    }

    async updateVisibility(item) {
      this.data.forEach(dataItem => {
        if (dataItem != item) dataItem.isDropdownVisible = false;
      });
      item.isDropdownVisible = !(item.isDropdownVisible);
      this.notify();
    }

    async filter(id, value, year, month, day) {
      this.data = [];
      const response = await fetchClient('/api/getData/filter', {
          method: 'PATCH',
          headers: {'Content-type': 'application/json; charset=UTF-8'},
          body: JSON.stringify({id:id, value: value, year: year, month: month, day: day}),
      });
      const content = await response.json().then(data => {
        for (const item of data.map(item => {
          item.isDropdownVisible = false;
          return item;
        })) {
          this.data.push(item);
        }
      });
      this.notify();
    }

    async wait() {
      this.spinner = true;
      this.notify();
      await sleep(3000);
      this.spinner = false;
      this.loaded = true;
      this.notify();
    }
}