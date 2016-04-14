import 'babel-polyfill';
import test from 'tape';
import Parser from '../src/parser';
import { raw } from '../src/datasets';
import { join, resolve } from 'path';

const FIXTURES = join(__dirname, 'fixtures', 'pywwsdata')

test('Parser', assert => {

  assert.ok(Parser
    , `parser should be defined`);
  
  const p = new Parser('foo', ['bar']);
  assert.equal(p.type, 'foo'
    , `Constructor sets parser type`);
  assert.deepEqual(p.columns, ['bar']
    , `Constructor sets parser columns schema`);

  assert.end();
});

test('Parser.getCSV', async assert => {
  const d1 = new Date('2014-12-03');
  const d2 = new Date('2014-12-03');
  const filenames = raw.getFilenameRange(d1, d2);
  const file = resolve(FIXTURES, filenames[0]);
  const res = await raw.getCSV(file);

  assert.ok(Array.isArray(res)
    , `return value should be an Array`);

  assert.ok(res.length > 0
    , `returned array should not be empty`);
  
  assert.end();
});

test('Parser.get', async assert => {
  const d1 = new Date('2014-12-03');
  let d2 = new Date('2014-12-03');

  d2 = new Date(d2.setDate(d2.getDate() + 1));
  let res = await raw.get(FIXTURES, d1, d2);

  assert.ok(Array.isArray(res)
    , `Result is returned`);
  
  assert.ok(res.length > 0
    , `Result length is > 0`);
  
  d2 = new Date(d2.setDate(d2.getDate() + 1));
  const [ row ] = await raw.get(FIXTURES, d1, d2, ['idx']);

  assert.deepEqual(
    Object.keys(row),
    ['idx'],
    `Can specify which columns to fetch`
  );
  
  assert.end();
});

test('Parser.getOne', async assert => {
  const d1 = new Date('2014-12-03T12:00:00');

  let res = await raw.getOne(FIXTURES, d1, true);

  assert.ok(typeof res === 'object'
    , `gets first piece of data AFTER date`);
  
  res = await raw.getOne(FIXTURES, d1);

  assert.ok(typeof res === 'object'
    , `gets first piece of data BEFORE date`);

  assert.end();
});

test('Parser.getFirst', async assert => {

  let res = await raw.getFirst(FIXTURES);

  assert.ok(res !== null
    , `gets result`);

  assert.equal(typeof res, 'object'
    , `gets object`);
  
  assert.end();
});

test('Parser.getLatest', async assert => {

  let res = await raw.getLatest(FIXTURES);

  assert.ok(res !== null
    , `gets result`);

  assert.equal(typeof res, 'object'
    , `gets object`);
  
  assert.end();
});
