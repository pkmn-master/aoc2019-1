const fileUtils = require('../utils/file-utils');
const IntCodeComputer = require('../classes/intcode-comp');

const integers = fileUtils
    .readInput('day5.txt')
    .split(',')
    .map(i => parseInt(i.toString()));

const computer = new IntCodeComputer(integers);

partOne();

function partOne() {
    const value = computer.execute(12, 2);
    console.log('part 1', value);
}
