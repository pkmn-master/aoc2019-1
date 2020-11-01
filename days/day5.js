const fileUtils = require('../utils/file-utils');
const IntCodeComputer = require('../classes/intcode-comp');

const integers = fileUtils
    .readInput('day5.txt')
    .split(',')
    .map(i => parseInt(i.toString()));

const computer = new IntCodeComputer(integers);

partOne();
partTwo();

function partOne() {
    const value = computer.executeSequential();
    console.log('part 1', value);
}

function partTwo() {
    
}
