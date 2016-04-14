import Parser from '../parser';

/**
 * @class PywwsDailyDataset
 *
 * Pywws hourly dataset
 *
 */
const COLUMNS = [
  'idx',
  'start',
  'hum_out_ave',
  'hum_out_min',
  'hum_out_min_t',
  'hum_out_max',
  'hum_out_max_t',
  'temp_out_ave',
  'temp_out_min',
  'temp_out_min_t',
  'temp_out_max',
  'temp_out_max_t',
  'hum_in_ave',
  'hum_in_min',
  'hum_in_min_t',
  'hum_in_max',
  'hum_in_max_t',
  'temp_in_ave',
  'temp_in_min',
  'temp_in_min_t',
  'temp_in_max',
  'temp_in_max_t',
  'abs_pressure_ave',
  'abs_pressure_min',
  'abs_pressure_min_t',
  'abs_pressure_max',
  'abs_pressure_max_t',
  'rel_pressure_ave',
  'rel_pressure_min',
  'rel_pressure_min_t',
  'rel_pressure_max',
  'rel_pressure_max_t',
  'wind_ave',
  'wind_gust',
  'wind_gust_t',
  'wind_dir',
  'rain',
  'illuminance_ave',
  'illuminance_max',
  'illuminance_max_t',
  'uv_ave',
  'uv_max',
  'uv_max_t',
];
class PywwsDailyDataset extends Parser {

  /**
   * @constructs PywwsDailyDataset
   */
  constructor() {
    super('daily', COLUMNS);

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
      [year, month, '01'].join('-')
    ].join('/');
  }
}

const instance = new PywwsDailyDataset();

export {
  instance as default,
  COLUMNS,
  PywwsDailyDataset,
}
