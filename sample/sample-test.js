const fs = require("fs");

let GraphUtils = require("../src/graph-utils");

function readFile() {
    let content = fs.readFileSync("./sample/data_4.json", "utf-8");
    return content;
}

function writeFile(content) {
    fs.writeFileSync("./sample/data-simplify.json", content);
}

let content = JSON.parse(readFile());

let graphUtils = new GraphUtils(content);
graphUtils.bundle();
graphUtils.simplify();
content = graphUtils.result();

writeFile(JSON.stringify(content));