//detect if the obj is real or returns as null or undefined
export default function isRealObj(obj) {
    return obj && obj !== 'null' && obj !== 'undefined';
}
