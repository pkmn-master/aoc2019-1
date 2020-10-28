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
 * @param operation {number}
 */
const validOperation = function (operation) {
    return Object.values(operations).indexOf(operation) !== -1;
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

        if (!validOperation(opCode.operation)) {
            continue;
        }

        opCodeInstructions.push({
            opCode,
            inputs,
        })
    }

    return opCodeInstructions;
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
    const values = getValues(opCodeInstruction, integers);

    switch (opCodeInstruction.opCode.operation) {
        case operations.add:
            return values[0] + values[1];
        case operations.multiply:
            return values[0] * values[1];
        case operations.store:
        case operations.output:
            return values[0];
        case 99:
            return null;
    }
}

const getValues = function (opCodeInstruction, integers) {
    const values = [];

    for (let i = 0; i < opCodeInstruction.opCode.parameterModes.length && i < opCodeInstruction.inputs.length; i++) {
        const paramMode = opCodeInstruction.opCode.parameterModes[i];
        const value = paramMode === paramModes.position ? integers[opCodeInstruction.inputs[i]] : opCodeInstruction.inputs[i];

        values.push(value);
    }

    return values;
}
