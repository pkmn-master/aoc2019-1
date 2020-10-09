const fs = require('fs');
const path = require('path');

exports.readLines = function (filePath) {
    return fs
        .readFileSync(filePath, {
            encoding: 'utf8'
        })
        .split('\r\n')
        .filter(line => {
            // no empty lines
            return !!line;
        });
};

exports.getInputFilePath = function(inputFileName) {
    return path.normalize(path.join(__dirname, '../inputs', inputFileName));
}

exports.readInputLines = function(inputFileName) {
    return exports.readLines(exports.getInputFilePath(inputFileName));
}
