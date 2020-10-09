const fileUtils = require('../utils/file-utils');
const mathUtils = require('../utils/math-utils');

const modules = fileUtils
    .readInputLines('day1.txt')
    .map(module => {
        return parseInt(module);
    });

const part1masses = modules.map(module => {
    return calculateMass(module);
});

const part1total = mathUtils.sum(part1masses);

const part2masses = modules.map(module => {
    let mass = module;
    let total = 0;

    while (true) {
        mass = calculateMass(mass);
        if (mass <= 0) {
            return total;
        }
        total += mass;
    }
});

const part2total = mathUtils.sum(part2masses);

function calculateMass(mass) {
    return Math.floor(mass / 3) - 2;
}

console.log('part1', part1total);
console.log('part2', part2total);

