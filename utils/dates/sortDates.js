/**
 * [sortDates]
 * @param  {Array} datesArray [an array with objects]
 * @param  {String} sortBy
 * @param  {String} target [the element which is the date to be sorted like createdAt]
 * @return {Array} Array with sorted dates
 */
function sortDates(dates, options = {}) {
    const { sortBy = "latest", target = "createdAt" } = options;

    const validSort = ["latest", "oldest"];
    if (!validSort.includes(sortBy))
        return console.log("sortBy can only be these values: " + validSort);

    if (sortBy === "latest") {
        dates.sort((a, b) => b[target].getTime() - a[target].getTime()); // n1
    } else {
        dates.sort((a, b) => a[target].getTime() - b[target].getTime());
    }

    return dates;
}

module.exports = sortDates;

/* COMMENTS
n1: about getTime()
The getTime() method returns the number of milliseconds* since the Unix Epoch.

const moonLanding = new Date('July 20, 69 00:20:18 GMT+00:00');

// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
console.log(moonLanding.getTime());
// expected output: -14254782000
*/
