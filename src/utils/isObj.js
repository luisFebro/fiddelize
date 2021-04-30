// reference: https://github.com/lodash/lodash/blob/4.8.0-npm/isObject.js
// detect if the obj is real or returns as null or undefined
/*
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

export default function isObj(value, options = {}) {
    const { noArrays = false } = options;

    const type = typeof value;
    const generalRes = !!value && (type === "object" || type === "function");

    if (noArrays) {
        const isArrayObj = Array.isArray(value);
        return !isArrayObj && generalRes;
    }

    return generalRes;
}
