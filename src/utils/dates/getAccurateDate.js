import axios from "axios";

// This date is not based on client's system to avoid bugs and system misbehaviors.
export default async function getAccurateDate() {
    try {
        // The API returns minutes passed since epoch, for performance reasons. Convert it to milliseconds and then construct your date object // https://stackoverflow.com/questions/53005544/when-the-time-of-system-is-wrong-how-can-i-get-correct-time-in-javascript
        const genDate = await axios(
            "https://currentmillis.com/time/minutes-since-unix-epoch.php"
        );
        const { data: currDate } = genDate;
        return new Date(parseInt(currDate) * 1000 * 60);
    } catch (e) {
        console.log(e);
    }
}
