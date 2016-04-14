import Parser from '../parser';

/**
 * @class PywwsRawDataset
 *
 * Pywws raw dataset
 *
 */
const COLUMNS = [
  'idx',
  'delay',
  'hum_in',
  'temp_in',
  'hum_out',
  'temp_out',
  'abs_pressure',
  'wind_ave',
  'wind_gust',
  'wind_dir',
  'rain',
  'status',
  'illuminance',
  'uv',
];
export class PywwsRawDataset extends Parser {

  /**
   * @constructs PywwsRawDataset
   */
  constructor() {
    super('raw', COLUMNS);

    // Constructor
  }

  /**
   * @function getFilename
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   */
  getFilename(year, month, day) {
    return [
      year,
      year + '-' + month,
      [year, month, day].join('-')
    ].join('/');
  }
}

const instance = new PywwsRawDataset();

export {
  instance as default,
  COLUMNS,
  PywwsRawDataset,
}
