const fs = require("fs");

class GraphTestUtils {

    static readFile(filePath) {
        let content = fs.readFileSync(filePath, "utf-8");
        if (content) {
            return JSON.parse(content);
        }
        return null;
    }

    static writeFile(fileOut, content) {
        fs.writeFileSync(fileOut, JSON.stringify(content));
    }

}

module.exports = GraphTestUtils;