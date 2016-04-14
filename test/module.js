import * as _module from '..';
import test from 'tape';

test('Module exports', assert => {

  ['raw', 'hourly', 'daily', 'monthly'].forEach(
    dataset => assert.ok(dataset in _module
      , `Module exports ${dataset} dataset`)
  );

  assert.ok('Parser' in _module
    , `Module exports Parser class`);
  
  assert.end();
});
