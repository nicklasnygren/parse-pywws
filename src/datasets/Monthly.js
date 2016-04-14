import Parser from '../parser';

/**
 * @class PywwsMonthlyDataset
 *
 * Pywws monthly dataset
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
  'temp_out_min_lo',
  'temp_out_min_lo_t',
  'temp_out_min_hi',
  'temp_out_min_hi_t',
  'temp_out_min_ave',
  'temp_out_max_lo',
  'temp_out_max_lo_t',
  'temp_out_max_hi',
  'temp_out_max_hi_t',
  'temp_out_max_ave',
  'hum_in_ave',
  'hum_in_min',
  'hum_in_min_t',
  'hum_in_max',
  'hum_in_max_t',
  'temp_in_ave',
  'temp_in_min_lo',
  'temp_in_min_lo_t',
  'temp_in_min_hi',
  'temp_in_min_hi_t',
  'temp_in_min_ave',
  'temp_in_max_lo',
  'temp_in_max_lo_t',
  'temp_in_max_hi',
  'temp_in_max_hi_t',
  'temp_in_max_ave',
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
  'rain_days',
  'illuminance_ave',
  'illuminance_max_lo',
  'illuminance_max_lo_t',
  'illuminance_max_hi',
  'illuminance_max_hi_t',
  'illuminance_max_ave',
  'uv_ave',
  'uv_max_lo',
  'uv_max_lo_t',
  'uv_max_hi',
  'uv_max_hi_t',
  'uv_max_ave',
];
export class PywwsMonthlyDataset extends Parser {

  /**
   * @constructs PywwsMonthlyDataset
   */
  constructor() {
    super('monthly', COLUMNS);

    // Constructor
  }

  /**
   * @function getFilename
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   */
  getFilename(year, month, day) {
    return [year, '01', '01'].join('-');
  }
}

const instance = new PywwsMonthlyDataset();

export {
  instance as default,
  COLUMNS,
  PywwsMonthlyDataset,
}
