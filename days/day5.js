const fileUtils = require('../utils/file-utils');
const computer = require('../utils/intcode-comp');

const integers = fileUtils
    .readInput('day5-example.txt')
    .split(',')
    .map(i => parseInt(i.toString()));

partOne();

function partOne() {
    const min = 0;
    const max = 99;

    const value = computer.calculateWithStop(integers, min, max, 19690720);
    console.log('part 1', value);
}
