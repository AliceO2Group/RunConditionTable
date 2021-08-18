import { Observable, fetchClient } from '/js/src/index.js';
import { parseMonthModel, parseDay } from './utils/dateHelper.js';
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
      const filters = {
        id: id,
        value: value,
        date: (year && month && day) ? `${year}-${parseMonthModel(month)}-${parseDay(day)}` : undefined,
      };

      let queryString = `?`;
      let next = false;
      
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== "") {
          if (next) queryString += '&';
          if (key == 'date') queryString += `${key}='${value}'`;
          else queryString += `${key}=${value}`;
          next = true;
        }
      }
      
      const response = await fetchClient(`/api/getData${queryString}`, {
          method: 'GET',
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
