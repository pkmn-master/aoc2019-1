const fileUtils = require('../utils/file-utils');
const IntCodeComputer = require('../classes/intcode-comp');

const integers = fileUtils
    .readInput('day5.txt')
    .split(',')
    .map(i => parseInt(i.toString()));

partOne();
partTwo();

function partOne() {
    const computer = new IntCodeComputer(integers);
    console.log('running part 1');
    computer.executeSequential();
}

function partTwo() {
    const computer = new IntCodeComputer(integers);
    console.log('running part 2');
    computer.executeSequential();

}
