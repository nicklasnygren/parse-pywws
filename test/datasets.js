import test from 'tape';
import Parser from '../src/parser';
import * as datasets from '../src/datasets';

test('Datasets', assert => {
  const datasetNames = Object.keys(datasets);

  assert.deepEqual(
    datasetNames,
    ['raw', 'hourly', 'daily', 'monthly'],
    `All the real-data pywws datasets should be among the exported ones`
  );

  datasetNames.forEach(name => {
    const dataset = datasets[name];

    assert.ok(dataset instanceof Parser
      , `${name} is a Parser instance`);
  });

  assert.end();
});
