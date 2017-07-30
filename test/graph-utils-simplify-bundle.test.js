const GraphUtils = require('../src/graph-utils');
const GraphTestUtils = require('./graph-test-utils');

test('simplify then bundle: data set diabolo', () => {
    let data = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.json');
    let data_result = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.simplify.bundle.json');

    let simplifyData = new GraphUtils(data).simplify().bundle().result();

    expect(simplifyData).toEqual(data_result);
});
