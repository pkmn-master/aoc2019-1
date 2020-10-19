/**
 * --- Day 4: Secure Container ---
 You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

 However, they do remember a few key facts about the password:

 It is a six-digit number.
 The value is within the range given in your puzzle input.
 Two adjacent digits are the same (like 22 in 122345).
 Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
 Other than the range rule, the following are true:

 111111 meets these criteria (double 11, never decreases).
 223450 does not meet these criteria (decreasing pair of digits 50).
 123789 does not meet these criteria (no double).
 How many different passwords within the range given in your puzzle input meet these criteria?

 Your puzzle answer was 1764.

 --- Part Two ---
 An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

 Given this additional criterion, but still ignoring the range rule, the following are now true:

 112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
 123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
 111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
 How many different passwords within the range given in your puzzle input meet all of the criteria?

 Your puzzle answer was 1196.
 */

const fileUtils = require('../utils/file-utils.js');

const part1input = fileUtils.readInput('day4.txt');

const part1range = part1input
    .trim()
    .split('-')
    .map(val => {
        return parseInt(val);
    });


partOne();
partTwo();

function partOne() {
    const passwords = getMatchedPasswords(false);
    console.log('part one', passwords.length, 'passwords found');
}


function partTwo() {
    const passwords = getMatchedPasswords(true);
    console.log('part two', passwords.length, 'passwords found');
}

function getMatchedPasswords(doubleValueOnce) {
    const passwords = [];
    for (let password = part1range[0]; password <= part1range[1]; password++) {
        if (isValidPassword(password, doubleValueOnce)) {
            passwords.push(password);
        }
    }

    return passwords;
}

/**
 *
 * @param password number
 * @param doubleValueOnce true
 */
function isValidPassword(password, doubleValueOnce) {
    const _chars = password.toString().split('');
    if (_chars.length !== 6) {
        return false;
    }

    const matchMap = _chars
        .reduce((map, char) => {
            if (!map[char]) {
                map[char] = 0;
            }
            map[char]++;
            return map;
        }, {});

    if (!Object
        .keys(matchMap)
        .find(key => {
            return doubleValueOnce ? matchMap[key] === 2 : matchMap[key] >= 2;
        })) {
        // no double found
        return false;
    }

    for (let i = 1; i < _chars.length; i++) {
        const charA = _chars[i - 1];
        const charB = _chars[i];
        if (parseInt(charA) > parseInt(charB)) {
            return false;
        }
    }

    return true;
}
