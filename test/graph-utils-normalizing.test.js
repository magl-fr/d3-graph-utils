const GraphUtils = require('../src/graph-utils');
const GraphTestUtils = require('./graph-test-utils');


test('normalizing / denormalizing: data set 1', () => {
    let data = GraphTestUtils.readFile('./test/data/data_1.json');
    expect(new GraphUtils(data).result()).toEqual(data);
});

test('normalizing / denormalizing: data set 2', () => {
    let data = GraphTestUtils.readFile('./test/data/data_2.json');
    expect(new GraphUtils(data).result()).toEqual(data);
});

test('normalizing / denormalizing: data set 3', () => {
    let data = GraphTestUtils.readFile('./test/data/data_3.json');
    expect(new GraphUtils(data).result()).toEqual(data);
});

test('normalizing / denormalizing: data set 4', () => {
    let data = GraphTestUtils.readFile('./test/data/data_4.json');
    expect(new GraphUtils(data).result()).toEqual(data);
});

test('normalizing / denormalizing: data set diabolo', () => {
    let data = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.json');
    expect(new GraphUtils(data).result()).toEqual(data);
});
