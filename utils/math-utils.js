/**
 * 
 * @param values {number[]}
 * @returns {number}
 */
exports.sum = function(values) {
    return values.reduce((total, value) => {
        return total + value;
    }, 0);
}
