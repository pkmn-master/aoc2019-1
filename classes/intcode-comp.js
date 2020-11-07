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
    
    setNounVerb(noun, verb) {
        if (noun !== null) {
            this.integers[1] = noun;
        }

        if (verb !== null) {
            this.integers[2] = verb;
        }
    }

    /**
     *
     * @param noun {number | null}
     * @param verb {number | null}
     */
    execute(noun = null, verb = null) {
        this.setNounVerb(noun, verb);

        this.executeInstructions();

        return this.integers[0];
    }

    /**
     *
     * @param noun {number | null}
     * @param verb {number | null}
     */
    executeSequential(noun = null, verb = null) {
        this.setNounVerb(noun, verb);

        this.executeInstructionsSequential();

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
    executeInstructionsSequential() {
        let opCodeInstruction;
        for (let i = 0; i < this.integers.length; ) {
            // console.log('index', i);
            opCodeInstruction = OpCodeInstruction.fromInstructions(this.integers, i);
            i = opCodeInstruction.execute(this.integers, i);
        }
    }

    executeInstructions() {
        const opCodeInstructions = this.parseInstructions();
        for (let i = 0; i < opCodeInstructions.length; i++) {
            opCodeInstructions[i].execute(this.integers);
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
