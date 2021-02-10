// reference: https://github.com/lodash/lodash/blob/4.8.0-npm/isObject.js
//detect if the obj is real or returns as null or undefined
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

export default function isRealObj(value) {
    var type = typeof value;
    return !!value && (type === "object" || type === "function");
    // return obj && obj !== 'null' && obj !== 'undefined';
}
