const listUtils = require('./list-utils')
const _ = require('lodash');

/**
 * @property operation {number}
 * @property parameter1Mode {paramModes}
 * @property parameter2Mode {paramModes}
 * @property parameter3Mode {paramModes}
 */
class OpCode {

}

/**
 * @property opCode {OpCode}
 * @property input1Position {number}
 * @property input2Position {number}
 * @property outputPosition {number}
 */
class OpCodeInstruction {

}

const operations = {
    add: 1,
    multiply: 2
};

const paramModes = {
    position: 0,
    immediate: 1
};

const reverse = function (string) {
    return string.split('').reverse().join('');
}

/**
 *
 * @param value {number}
 * @returns {OpCode}
 */
const toOpCode = function (value) {
    const _value = _.padStart(value.toString(), 5, '0');
    const operation = _value.slice(_value.length - 2);
    const parameters =
        reverse(_value.slice(0, _value.indexOf(operation)))
            .split('')
            .map(v => parseInt(v));

    return {
        operation: parseInt(operation),
        parameter1Mode: parameters[0],
        parameter2Mode: parameters[1],
        parameter3Mode: parameters[2],
    };
}

/**
 *
 * @param integers {number[]}
 * @returns {OpCodeInstruction[]}
 */
exports.createOpCodes = function (integers) {
    return listUtils
        .splitIntoGroups(integers, 4)
        .map(group => {
            return {
                opCode: toOpCode(group[0]),
                input1Position: group[1],
                input2Position: group[2],
                outputPosition: group[3]
            }
        });

}

exports.calculate = function (integers, noun, verb) {
    const _integers = listUtils.copy(integers);

    _integers[1] = noun;
    _integers[2] = verb;

    const opCodes = exports.createOpCodes(_integers);

    for (let i = 0; i < opCodes.length; i++) {
        const opCode = opCodes[i];
        const value = getValue(opCode, _integers);

        if (value === null) {
            break;
        }
        storeValue(opCode, _integers, value);
    }

    return _integers[0];
}

/**
 *
 * @param integers {number[]}
 * @param min {number}
 * @param max {number}
 * @param stop {number}
 *
 * @returns {number}
 */
exports.calculateWithStop = function (integers, min, max, stop) {
    let value = 0;

    for (let noun = min; noun <= max; noun++) {
        for (let verb = min; verb <= max; verb++) {
            value = exports.calculate(integers, noun, verb);
            if (value === stop) {
                return 100 * noun + verb;
            }
        }
    }

    return null;
}

/**
 *
 * @param opCodeInstruction {OpCodeInstruction}
 * @param integers number[]
 * @param value number
 */
const storeValue = function (opCodeInstruction, integers, value) {
    switch (opCodeInstruction.opCode.parameter3Mode) {
        case paramModes.position:
            integers[opCodeInstruction.outputPosition] = value;
            break;
    }
}

/**
 *
 * @param opCode {OpCodeInstruction}
 * @param integers
 * @returns {null|number|*}
 */
const getValue = function (opCode, integers) {
    const value1Parameter = opCode.opCode.parameter1Mode;
    const value2Parameter = opCode.opCode.parameter2Mode;
    const value1 = value1Parameter === paramModes.position ? integers[opCode.input1Position] : opCode.input1Position;
    const value2 = value2Parameter === paramModes.position ? integers[opCode.input2Position] : opCode.input2Position;

    switch (opCode.opCode.operation) {
        case operations.add:
            return value1 + value2;
        case operations.multiply:
            return value1 * value2;
        case 99:
            return null;
    }
}
