const _ = require('lodash');
const stringUtils = require('../utils/string-utils');
const prompt = require('prompt-sync')();

/**
 * @property operation {OpCodeInstruction.operations}
 * @property parameterCount {number}
 * @property inputs {number[]}
 * @property parameterModes {OpCodeInstruction.paramModes[]}
 */
class OpCodeInstruction {

    static operations = {
        unknown: 0,
        add: 1,
        multiply: 2,
        store: 3,
        output: 4,
        jumpIfTrue: 5,
        jumpIfFalse: 6,
        lessThan: 7,
        equals: 8
    };

    static paramModes = {
        position: 0,
        immediate: 1
    };

    constructor(init) {
        this.parameters = init.parameters || [];

        this.operation = init.operation || OpCodeInstruction.operations.unknown;
        this.parameterModes = init.parameterModes || [];
    }

    /**
     * @return {number}
     */
    parameterCount() {
        return OpCodeInstruction.parameterCount(this.operation);
    }

    /**
     *
     * @param operation {OpCodeInstruction.operations}
     */
    static parameterCount(operation) {
        switch (operation) {
            case OpCodeInstruction.operations.add:
            case OpCodeInstruction.operations.multiply:
            case OpCodeInstruction.operations.lessThan:
            case OpCodeInstruction.operations.equals:
                return 3;
            case OpCodeInstruction.operations.store:
            case OpCodeInstruction.operations.output:
                return 1;
            case OpCodeInstruction.operations.jumpIfTrue:
            case OpCodeInstruction.operations.jumpIfFalse:
                return 2;
        }
    }

    /**
     * @param integers {number[]}
     *
     * @returns {null|number|*}
     */
    getValue(integers) {
        const values = this.getValues(integers);

        switch (this.operation) {
            case OpCodeInstruction.operations.add:
                return values[0] + values[1];
            case OpCodeInstruction.operations.multiply:
                return values[0] * values[1];
            case OpCodeInstruction.operations.store:
                // return 5;
                return parseInt(prompt('specify ID: '));
            case OpCodeInstruction.operations.output:
                return values[0];
            case 99:
                return null;
            case OpCodeInstruction.operations.jumpIfTrue:
                return values[0] !== 0 ? values[1] : null;
            case OpCodeInstruction.operations.jumpIfFalse:
                return values[0] === 0 ? values[1] : null;
            case OpCodeInstruction.operations.lessThan:
                return values[0] < values[1] ? 1 : 0;
            case OpCodeInstruction.operations.equals:
                return values[0] === values[1] ? 1 : 0
        }
    }

    /**
     * @param integers {number[]}
     *
     * @returns {number[]}
     */
    getValues(integers) {
        const values = [];

        for (let i = 0, l = this.parameterCount(); i < l; i++) {
            const paramMode = this.parameterModes[i];
            const value = paramMode === OpCodeInstruction.paramModes.position ?
                integers[this.parameters[i]] :
                this.parameters[i];

            values.push(value);
        }

        return values;
    }

    /**
     * @param integers {number[]}
     * @param pointer {number}
     * @returns {number} pointer
     */
    execute(integers, pointer) {
        // console.log(this);
        const value = this.getValue(integers);

        switch (this.operation) {
            case OpCodeInstruction.operations.add:
            case OpCodeInstruction.operations.multiply:
            case OpCodeInstruction.operations.lessThan:
            case OpCodeInstruction.operations.equals:
                this.store(integers, value, 2);
                break;
            case OpCodeInstruction.operations.store:
                this.store(integers, value, 0);
                break;
            case OpCodeInstruction.operations.output:
                if (value > 0) {
                    console.log(value);
                }
                break;
            case OpCodeInstruction.operations.jumpIfTrue:
            case OpCodeInstruction.operations.jumpIfFalse:
                if (value !== null) {
                    return value;
                }
                break;
        }

        return pointer + this.parameterCount() + 1;
    }

    /**
     * @param integers {number[]}
     * @param value number
     * @param paramIndex number
     */
    store(integers, value, paramIndex) {
        const paramMode = this.parameterModes[paramIndex];
        const parameter = this.parameters[paramIndex];

        switch (paramMode) {
            case OpCodeInstruction.paramModes.immediate:
                break;
            case OpCodeInstruction.paramModes.position:
                integers[parameter] = value;
                break;
        }
    }

    /**
     *
     * @param integers {number[]}
     * @param index {number}
     *
     * @returns {OpCodeInstruction}
     */
    static fromInstructions(integers, index) {
        const instr = _.padStart(integers[index].toString(), 5, '0');
        const operation = OpCodeInstruction.parseOperation(instr);

        const parameterModes =
            stringUtils.reverse(instr.slice(0, 3))
                .split('')
                .map(v => parseInt(v));
        const paramStart = index + 1;

        const parameters = integers.slice(paramStart, paramStart + OpCodeInstruction.parameterCount(operation));

        return new OpCodeInstruction({
            operation,
            parameterModes,
            parameters
        });
    }

    /**
     *
     * @param operation {string}
     *
     * @returns OpCodeInstruction.operations
     */
    static parseOperation(operation) {
        const _operation = operation.slice(operation.length - 2);

        return parseInt(_operation);
    }

}

module.exports = OpCodeInstruction;
