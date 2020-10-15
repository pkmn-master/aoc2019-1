const fs = require('fs');
const path = require('path');

const read = function (filePath) {
    return fs
        .readFileSync(filePath, {
            encoding: 'utf8'
        });
}

const readLines = function (filePath) {
    return read(filePath)
        .split('\r\n')
        .filter(line => {
            // no empty lines
            return !!line;
        });
};

const getInputFilePath = function (inputFileName) {
    return path.normalize(path.join(__dirname, '../inputs', inputFileName));
}

/**
 * Return file contents as an array of strings, line by line of the file
 * 
 * @param inputFileName the file to read
 */
exports.readInputLines = function (inputFileName) {
    return readLines(getInputFilePath(inputFileName));
}

/**
 * Return file contents as a single string
 */
exports.readInput = function (inputFileName) {
    return read(getInputFilePath(inputFileName));
}
