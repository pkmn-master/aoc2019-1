const listUtils = require('./list-utils')

const operations = {
    add: 1,
    multiply: 2,
    address: 3,
    value: 4
};

const reverse = function (string) {
    return string.split('').reverse().join('');
}

const toOpCodes = function (value) {
    const _value = value.toString();
    const operation = _value.slice(_value.length - 2);
    const parameters =
        reverse(_value.slice(0, _value.indexOf(operation)))
            .split('')
            .map(v => parseInt(v));

    return {
        operation: parseInt(operation),
        parameters
    };
}

exports.calculate = function (integers, noun, verb) {
    const _integers = listUtils.copy(integers);

    _integers[1] = noun;
    _integers[2] = verb;

    const opCodes = listUtils
        .splitIntoGroups(_integers, 4)
        .map(group => {
            return {
                opCode: toOpCodes(group[0]),
                input1Position: group[1],
                input2Position: group[2],
                outputPosition: group[3]
            }
        });


    for (let i = 0; i < opCodes.length; i++) {
        const opCode = opCodes[i];
        let haltProgram = false;
        let value;
        switch (opCode.opCode.operation) {
            case operations.add:
                value = _integers[opCode.input1Position] + _integers[opCode.input2Position];
                break;
            case operations.multiply:
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
