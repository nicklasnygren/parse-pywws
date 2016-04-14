import test from 'tape';
import { dateRange, intRange } from '../src/utils';
import moment from 'moment';

test('Date range', assert => {

  let d1 = +moment();
  let d2 = moment().add(1, 'days').format();
  let res = dateRange(d1, d2);

  assert.ok(Array.isArray(res)
    , `dateRange returns array`);
  
  assert.equal(res.length, 2
    , `There should be 2 dates returned when date span is one day`);

  d2 = moment().add(4, 'days');
  res = dateRange(d1, d2);

  assert.equal(res.length, 5
    , `There should be 5 dates returned when date span is 5 days`);
  
  assert.ok(res.every(d => (new Date(d)).getDate() >= new Date(d1).getDate())
    , `Returned dates should be greater than or equal to start date`);
  
  assert.ok(res.every(d => (new Date(d)).getDate() <= new Date(d2).getDate())
    , `Returned dates should be lower than or equal to end date`);
  
  assert.end();
});

test('Int range', assert => {
  
  assert.deepEqual(intRange(1, 5), [1, 2, 3, 4, 5]
    , `Returns range of ints`);
  
  assert.end();
});
