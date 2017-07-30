const GraphUtils = require('../src/graph-utils');
const GraphTestUtils = require('./graph-test-utils');

test('bundle: data set diabolo', () => {
    let data = GraphTestUtils.readFile('./test/data/data_4/data_4.json');

    let graphUtils = new GraphUtils(data);

    let aNode = graphUtils.nodesById["A"];

    graphUtils.removeLinksInLinks(aNode.links, {R1: true, D: true, E: true});

    expect(aNode.links).toEqual({ R2: true, R3: true, R4: true, R8: true });
});