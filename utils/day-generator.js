/**
 * This script generates the necessary files for starting a new day.
 *
 * usage:
 * npm run gen dayX
 * OR
 * node utils\day-generator.js dayX
 *
 * where X is replaced with a number
 *
 *
 * - updates package.json with a new script for the day specified
 * - creates input txt files for the day
 *
 */
const path = require('path');
const fileUtils = require('./file-utils');
const fs = require('fs');

const day = process.argv[2];

if (!day) {
    throw 'No day specified as argument';
}

updatePackage();
createDayInputFiles();
createDayScriptFile()

function updatePackage() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = fileUtils.read(packageJsonPath);

    const _package = JSON.parse(packageJson);

    if (!_package.scripts.hasOwnProperty(day)) {
        _package.scripts[day] = `node days/${day}.js`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(_package, null, 2));
    }
}

function createFile(fullPath) {
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '');
    }
}

function createDayInputFiles() {
    const dayInputFilePath = path.join(__dirname, '..', 'inputs', `${day}.txt`);
    const dayInputExampleFilePath = path.join(__dirname, '..', 'inputs', `${day}-example.txt`);
    createFile(dayInputFilePath);
    createFile(dayInputExampleFilePath);
}

function createDayScriptFile() {
    const dayScriptFilePath = path.join(__dirname, '..', 'days', `${day}.js`);
    createFile(dayScriptFilePath);
}
