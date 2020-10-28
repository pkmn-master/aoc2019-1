const listUtils = require('./list-utils')
const _ = require('lodash');

/**
 * @property operation {number}
 * @property parameterCount {number}
 * @property parameterModes {paramModes[]}
 */
class OpCode {

}

/**
 * @property opCode {OpCode}
 * @property inputs {number[]}
 */
class OpCodeInstruction {

}

const operations = {
    add: 1,
    multiply: 2,
    store: 3,
    output: 4
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

    const _operation = parseInt(operation);

    return {
        operation: _operation,
        parameterCount: getOperationParameterCount(_operation),
        parameterModes: parameters
    };
}

/**
 * @param operation {number}
 */
const getOperationParameterCount = function (operation) {
    switch (operation) {
        case operations.add:
        case operations.multiply:
            return 3;
        case operations.store:
        case operations.output:
            return 1;
    }
}

/**
 *
 * @param integers {number[]}
 * @returns {OpCodeInstruction[]}
 */
exports.parseInput = function (integers) {
    const opCodeInstructions = [];
    let opCode;
    for (let i = 0; i < integers.length; i += opCode.parameterCount + 1) {
        opCode = toOpCode(integers[i]);
        const paramStart = i + 1;
        const inputs = integers.slice(paramStart, paramStart + opCode.parameterCount);

        opCodeInstructions.push({
            opCode,
            inputs,
        })
    }
    
    return opCodeInstructions;

    // return listUtils
    //     .splitIntoGroups(integers, 4)
    //     .map(group => {
    //         return {
    //             opCode: toOpCode(group[0]),
    //             input1Position: group[1],
    //             input2Position: group[2],
    //             outputPosition: group[3]
    //         }
    //     });

}

exports.calculate = function (integers, noun, verb) {
    const _integers = listUtils.copy(integers);

    _integers[1] = noun;
    _integers[2] = verb;

    const opCodes = exports.parseInput(_integers);

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
 * @returns {number | null}
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
    switch (opCodeInstruction.opCode.parameterModes[2]) {
        case paramModes.position:
            integers[opCodeInstruction.inputs[2]] = value;
            break;
    }
}

/**
 *
 * @param opCodeInstruction {OpCodeInstruction}
 * @param integers
 * @returns {null|number|*}
 */
const getValue = function (opCodeInstruction, integers) {
    const value1ParamMode = opCodeInstruction.opCode.parameterModes[0];
    const value2ParamMode = opCodeInstruction.opCode.parameterModes[1];
    const value1 = value1ParamMode === paramModes.position ? integers[opCodeInstruction.inputs[0]] : opCodeInstruction.inputs[0];
    const value2 = value2ParamMode === paramModes.position ? integers[opCodeInstruction.inputs[1]] : opCodeInstruction.inputs[1];

    switch (opCodeInstruction.opCode.operation) {
        case operations.add:
            return value1 + value2;
        case operations.multiply:
            return value1 * value2;
        case 99:
            return null;
    }
}
