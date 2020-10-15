const fileUtils = require('../utils/file-utils');
const listUtils = require('../utils/list-utils')

const integers = fileUtils
    .readInput('day2.txt')
    .split(',')
    .map(val => {
        return parseInt(val);
    });

const part2StopValue = 19690720;

partOne();
partTwo();

function partOne() {
    const value = calculate(12, 2);
    console.log('part 1', value);
}

function partTwo() {
    let value = 0;
    const min = 0;
    const max = 99;

    for (let noun = min; noun <= max; noun++) {
        for (let verb = min; verb <= max; verb++) {
            value = calculate(noun, verb);
            if (value === part2StopValue) {
                console.log('part 2', 100 * noun + verb);
                return;
            }
        }
    }
    console.log('part 2 value not found');

}

function calculate(noun, verb) {
    const _integers = listUtils.copy(integers);

    _integers[1] = noun;
    _integers[2] = verb;

    const opCodes = listUtils
        .splitIntoGroups(_integers, 4)
        .map(group => {
            return {
                operation: group[0],
                input1Position: group[1],
                input2Position: group[2],
                outputPosition: group[3]
            }
        });


    for (let i = 0; i < opCodes.length; i++) {
        const opCode = opCodes[i];
        let haltProgram = false;
        let value;
        switch (opCode.operation) {
            case 1:
                value = _integers[opCode.input1Position] + _integers[opCode.input2Position];
                break;
            case 2:
                value = _integers[opCode.input1Position] * _integers[opCode.input2Position];
                break;
            case 99:
                haltProgram = true;
                break;
        }
        if (haltProgram) {
            break;
        }
        _integers[opCode.outputPosition] = value;
    }

    return _integers[0];
}


