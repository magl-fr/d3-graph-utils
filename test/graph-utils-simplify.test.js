const GraphUtils = require('../src/graph-utils');
const GraphTestUtils = require('./graph-test-utils');

test('simplify: data set diabolo', () => {
    let data = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.json');
    let data_result = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.simplify.json');

    let simplifyData = new GraphUtils(data).simplify().result();

    expect(simplifyData).toEqual(data_result);
});

test('simplify: data set 4', () => {
    let data = GraphTestUtils.readFile('./test/data/data_4/data_4.json');
    let data_result = GraphTestUtils.readFile('./test/data/data_4/data_4.simplify.json');

    let simplifyData = new GraphUtils(data).simplify().result();

    expect(simplifyData).toEqual(data_result);
});
