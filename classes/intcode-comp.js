const listUtils = require('../utils/list-utils')
const prompt = require('prompt-sync')();
const OpCodeInstruction = require('./op-code-instruction');

/**
 * @property integers {number[]}
 * @property opCodeInstructions {OpCodeInstruction[]}
 */
class IntCodeComputer {

    /**
     *
     * @param integers {number[]}
     */
    constructor(integers) {
        this.integers = listUtils.copy(integers);

        this.opCodeInstructions = this.parseInstructions();
    }

    /**
     *
     * @param noun {number | null}
     * @param verb {number | null}
     */
    execute(noun = null, verb = null) {
        if (noun) {
            this.integers[1] = noun;
        }

        if (verb) {
            this.integers[2] = verb;
        }

        this.executeInstructions();

        return this.integers[0];
    }

    /**
     * @param min {number}
     * @param max {number}
     * @param stop {number}
     * @returns {number | null}
     */
    executeWithStop(min, max, stop) {
        let value = 0;

        for (let noun = min; noun <= max; noun++) {
            for (let verb = min; verb <= max; verb++) {
                value = this.execute(noun, verb);
                if (value === stop) {
                    return 100 * noun + verb;
                }
            }
        }

        return null;
    }

    /**
     */
    executeInstructions() {
        for (let i = 0; i < this.opCodeInstructions.length; i++) {
            this.opCodeInstructions[i].execute(this.integers);
        }
    }

    parseInstructions() {
        const opCodeInstructions = [];
        let opCode;
        for (let i = 0; i < this.integers.length; i += opCode.parameterCount() + 1) {
            opCode = OpCodeInstruction.fromInstructions(this.integers, i);
            opCodeInstructions.push(opCode);
        }

        return opCodeInstructions;
    }
}

module.exports = IntCodeComputer;