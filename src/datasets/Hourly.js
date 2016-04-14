import Parser from '../parser';

/**
 * @class PywwsHourlyDataset
 *
 * Pywws hourly dataset
 *
 */
const COLUMNS = [
  'idx',
  'hum_in',
  'temp_in',
  'hum_out',
  'temp_out',
  'abs_pressure',
  'rel_pressure',
  'pressure_trend',
  'wind_ave',
  'wind_gust',
  'wind_dir',
  'rain',
  'illuminance',
  'uv',
];
export class PywwsHourlyDataset extends Parser {

  /**
   * @constructs PywwsHourlyDataset
   */
  constructor() {
    super('hourly', COLUMNS);

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

const instance = new PywwsHourlyDataset();

export {
  instance as default,
  COLUMNS,
  PywwsHourlyDataset,
}
