/**
 * turn a 1D array into a 2D array
 *
 * @param array array to split
 * @param groupSize the size of the internal groups
 *
 * @returns [][]
 */
exports.splitIntoGroups = function (array, groupSize) {
    const groups = [];
    for (let t = 0; t < array.length; t += groupSize) {
        const group = [];
        for (let i = t; i < t + groupSize && i < array.length; i++) {
            const value = array[i];
            group.push(value);
        }
        groups.push(group);
    }

    return groups;
}

/**
 * simple array copy function
 *
 * @param array array to copy
 *
 * @returns []
 */
exports.copy = function (array) {
    return array.reduce((copy, value) => {
        copy.push(value);
        return copy;
    }, []);
}