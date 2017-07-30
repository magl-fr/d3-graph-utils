const GraphUtils = require('../src/graph-utils');
const GraphTestUtils = require('./graph-test-utils');

test('bundle then simplify: data set diabolo', () => {
    let data = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.json');
    let data_result = GraphTestUtils.readFile('./test/data/data_diabolo/data_diabolo.bundle.simplify.json');

    let simplifyData = new GraphUtils(data).bundle().simplify().result();

    expect(simplifyData).toEqual(data_result);
});

test('bundle then simplify: data set 4', () => {
    let data = GraphTestUtils.readFile('./test/data/data_4/data_4.json');
    let data_result = GraphTestUtils.readFile('./test/data/data_4/data_4.bundle.simplify.json');

    let simplifyData = new GraphUtils(data).bundle().simplify().result();

    expect(simplifyData).toEqual(data_result);
});
