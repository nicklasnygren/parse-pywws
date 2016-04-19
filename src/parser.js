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
    const csvData = await Array.from(this.getFilenameRange(start, end))
      .reduce(async (values, name) => {

        values = await values;
        const csv = await this.getCSV(resolve(root, name));
    
        if (csv && csv.length) {
          const date = new Date(csv[0])
    
          // Verify that the date is actually withing the date range before adding it. Maybe a
          // partial days was provided in the arguments.
          if (date => start && date <= end) {
            return [...values, ...csv];
          }
        }
    
        return values;
      }, []);

    // Map the returned arrays to their corresponding column names
    return csvData.map(data => this.objectFactory(data, columns));
  }

  /**
   * @function getOne
   * @param {String} root
   * @param {Date} date
   * @param {Boolean} before
   * @param {Array} columns
   */
  async getOne(root, date, before, columns) {
    const getDateFilename = d => this.getFilenameForDate(d.toISOString().split('T')[0]);
    const dateTimeFilter = getDateTimeFilter(date, before);

    date = new Date(+date);
    let filename = resolve(root, getDateFilename(date));
    let fileExists;

    try {
      fileExists = await fs.statAsync(filename);
    }

    // We did not get a result on our first try. That means that the start date we selected is
    // before the first PYWWS record. We'll try looping dates until we reach a file that exists.
    //
    // FIXME: This is very unlikely to be the most performant way to do it.
    //
    catch (err) {
      let maxDate = (new Date()).setDate((new Date()).getDate() + 1);

      do {
        date.setDate(date.getDate() + 1);
        filename = resolve(root, getDateFilename(date));

        try {
          fileExists = await fs.statAsync(filename);

          if (fileExists) {
            break;
          }
        }
        catch (err) {
          //
        }
      } while (date <= maxDate);
    }

    if (fileExists) {
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
    const range = Array.from(intRange(1990, (new Date()).getFullYear()));
    let year;

    for (let i = 0; i < range.length; i++) {
      try {
        await fs.statAsync(resolve(root, `${this.type}/${range[i]}`));
        year = range[i];
        break;
      }
      catch (err) {
        // Year not found, continue trying on next one
      }
    }

    if (year) {
      return this.getOne(root, new Date(year + '-01-01 00:00:00'), false, ...params);
    }

    return null;
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
