import iniparser from 'iniparser';
import csv from 'csv';
import { dateRange, intRange, getDateTimeFilter } from './utils';
import _fs from 'fs';
import Promise from 'bluebird';
import { resolve } from 'path';

const fs = Promise.promisifyAll(_fs);
const parseCSV = Promise.promisify(csv.parse);
const parseINI = Promise.promisify(iniparser.parse);
const uniq = (val, idx, arr) => arr.indexOf(val) === idx;

/**
 * @class PywwsDataset
 */
export default class Parser {

  /**
   * @constructs PywwsDataset
   * @param {String} type What dataset?
   */
  constructor(type, columns) {
    this.type = type;
    this.columns = columns;
  }

  /**
   * @function getFilenameForDate
   * @param {String} date
   */
  getFilenameForDate(date) {
    const filename = this.getFilename(...date.split('-'));
    return `${this.type}/${filename}.txt`;
  }

  /**
   * @function objectFactory
   * @param {Array} data
   * @param {Array} columns
   */
  objectFactory(data, columns) {
    return data.reduce((map, value, idx) => {
      if (!columns || columns.indexOf(this.columns[idx]) !== -1) {
        map[this.columns[idx]] = value;
      }
      return map;
    }, {});
  }

  /**
   * @function getFilenameRange
   * @param {Date} start
   * @param {Date} end
   */
  * getFilenameRange(start, end) {
    const usedDates = new Set();
    for (let date of dateRange(start, end)) {
      date = this.getFilenameForDate(date);
      if (!usedDates.has(date)) {
        usedDates.add(date);
        yield date;
      }
    }
  }

  /**
   * @function getCSV
   * @param {String} path
   *
   * Get raw CSV data as Array from provided path
   */
  async getCSV(path) {
    let csv;

    try {
      const data = await fs.readFileAsync(path, 'utf-8');
      csv = await parseCSV(data);
    }
    catch (err) {
      csv = [];
    }
    return csv;
  }

  /**
   * @function get
   * @param {Date} start
   * @param {Date} end
   * @param {Array} columns
   *
   * Get all CSV contents from the specified date range, map array into objects
   */
  async get(root, start, end, columns = this.columns) {
    const _this = this;
    const data = [];

    await Promise.coroutine(function *() {
      for (const filename of _this.getFilenameRange(start, end)) {
        const csvData = yield _this.getCSV(resolve(root, filename));

        for (const item of csvData[Symbol.iterator]()) {

          if (item && item.length) {
            const date = new Date(item[0]);

            if (date => start && date <= end) {
              data.push(_this.objectFactory(item, columns));
            }
          }
        }
      }
    })();

    return data;
  }

  /**
   * @function getOne
   * @param {String} root
   * @param {Date} date
   * @param {Boolean} before
   * @param {Array} columns
   */
  async getOne(root, date, before, columns) {
    const _this = this;
    const dateTimeFilter = getDateTimeFilter(date, before);
    let filename;

    await Promise.coroutine(function *() {
      let _filename;
      for (const date of dateRange(new Date(+date), new Date())) {
        _filename = resolve(root, _this.getFilenameForDate(date));
        try {
          yield fs.statAsync(_filename);
          filename = _filename;
          break;
        }
        catch (err) {
          // File does not exist. Iterate date and try again.
        }
      }
    })();

    if (filename) {
      const csv = await this.getCSV(filename);
      let data;
      
      if (this.type === 'monthly') {
        data = [csv[0]];
      }
      else {
        data = csv.filter(dateTimeFilter);
      }
      
      if (data.length) {
        const item = data[before ? data.length -1 : 0];
        return this.objectFactory(item, columns);
      }
    }

    return null;
  }

  /**
   * @function getFirst
   */
  async getFirst(root, ...params) {
    const _this = this;
    let res = null;

    await Promise.coroutine(function * () {
      for (const year of intRange(1990, (new Date()).getFullYear())) {
        try {
          yield fs.statAsync(resolve(root, `${_this.type}/${year}`));
          res = yield _this.getOne(root, new Date(year + '-01-01 00:00:00'), false, ...params);
          break;
        }
        catch (err) {
          // Year not found, continue trying on next one
        }
      }
    })();

    return res;
  }

  /**
   * @function getLatest
   */
  async getLatest(root, ...params) {
    let status;

    try {
      status = await this.getStatus(root);
    }
    catch (err) {
      // Couldn't parse ini file
      return null;
    }

    const latestUpdate = status['last update'];
    const date = latestUpdate[this.type] || latestUpdate['logged'];

    if (date) {
      return this.getOne(root, new Date(date), true, ...params);
    }

    return null;
  }

  /**
   * @function getStatus
   * @param {String} root
   */
  async getStatus(root) {
    const iniData = await parseINI(`${root}/status.ini`);
    return iniData;;
  }
}
