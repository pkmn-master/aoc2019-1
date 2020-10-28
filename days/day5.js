const fileUtils = require('../utils/file-utils');
const computer = require('../utils/intcode-comp');

const integers = fileUtils
    .readInput('day5-example.txt')
    .split(',')
    .map(i => parseInt(i.toString()));

const opCodes = computer.parseInput(integers);

function partOne() {
    
}

console.log(integers);
console.log(opCodes);