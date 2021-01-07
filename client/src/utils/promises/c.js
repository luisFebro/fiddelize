// catch a promise to handle errors better
// https://stackoverflow.com/questions/40884153/try-catch-blocks-with-async-await

function c(promise) {
    return promise.then((data) => [null, data]).catch((err) => [err]);
}

module.exports = c;
