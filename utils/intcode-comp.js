
const listUtils = require('./list-utils')

exports.calculate = function (integers, noun, verb) {
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