const listUtils = require('../utils/list-utils')
const prompt = require('prompt-sync')();
const OpCodeInstruction = require('./op-code-instruction');

/**
 * @property integers {number[]}
 */
class IntCodeComputer {

    /**
     *
     * @param integers {number[]}
     */
    constructor(integers) {
        this.integers = listUtils.copy(integers);
    }

    /**
     *
     * @param noun {number | null}
     * @param verb {number | null}
     */
    execute(noun = null, verb = null) {
        if (!isNaN(noun)) {
            this.integers[1] = noun;
        }

        if (!isNaN(verb)) {
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
                console.log(value);
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
        let opCodeInstruction;
        for (let i = 0; i < this.integers.length; i += opCodeInstruction.parameterCount() + 1) {
            opCodeInstruction = OpCodeInstruction.fromInstructions(this.integers, i);
            opCodeInstruction.execute(this.integers);
        }
    }
}

module.exports = IntCodeComputer;