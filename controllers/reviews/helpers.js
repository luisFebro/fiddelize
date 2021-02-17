const getPercentage = require("../../utils/number/perc/getPercentage");

exports.getFinalGrade = ({ nps, xp }) => {
    if (!nps && !xp) return 5;
    if (nps && !xp) return nps;
    if (!nps && xp) return xp;

    return (nps + xp) / 2;
};

exports.getNpsChartResult = async ({
    docs,
    lastTotalPromoters = 3,
    lastTotalDetractors = 5,
}) => {
    lastTotalPromoters = Number(lastTotalPromoters);
    lastTotalDetractors = Number(lastTotalDetractors);

    const { totalWeekReviews, totalWeekProms } = docs;
    const generalTotalReviews = lastTotalPromoters + lastTotalDetractors;
    const totalCurrWeekReviews = totalWeekReviews ? totalWeekReviews.total : 0;
    const totalPriorReviews = generalTotalReviews - totalCurrWeekReviews;

    const totalCurrWeekProms = totalWeekProms ? totalWeekProms.total : 0;
    const totalPriorProms = lastTotalPromoters - totalCurrWeekProms;
    const totalCurrWeekDetr = totalCurrWeekReviews - totalCurrWeekProms;
    const totalPriorDetr = lastTotalDetractors - totalCurrWeekDetr;

    const run = async (resolve, reject) => {
        const data = getDocsData(docs);

        const weekNps = [];

        let dailyTotalReviews = 0;
        let dailyTotalProms = 0;
        let dailyTotalDetr = 0;

        for (let day in data) {
            const dataWeekDay = data[day];
            const { pro, det } = dataWeekDay;

            dailyTotalReviews += dataWeekDay.pro + dataWeekDay.det;
            dailyTotalProms += dataWeekDay.pro;
            dailyTotalDetr += dataWeekDay.det;

            weekNps.push({
                totalReviews: totalPriorReviews + dailyTotalReviews,
                pro: totalPriorProms + dailyTotalProms,
                det: totalPriorDetr + dailyTotalDetr,
            });
        }

        const chartResult = await Promise.all(
            weekNps.map((weekD) => getDayWeekNps(weekD))
        );
        resolve(chartResult);
    };

    return new Promise(run);
};

// my question: https://stackoverflow.com/questions/66021620/is-it-possible-to-destruct-a-large-object-only-once-in-javascripts-function
const getDayWeekNps = async ({ totalReviews, det, pro }) => {
    const percPromoters = getPercentage(totalReviews, pro);
    const percDetractors = getPercentage(totalReviews, det);
    const nps = Math.round(percPromoters - percDetractors);

    if (nps === 0) return "0.01"; // for chart which show undefined if not a string...

    return nps;
};

const getDocsData = (docs) => {
    const {
        monPro,
        monDet,
        tuePro,
        tueDet,
        wedPro,
        wedDet,
        thuPro,
        thuDet,
        friPro,
        friDet,
        satPro,
        satDet,
        sunPro,
        sunDet,
    } = docs;

    return {
        mon: {
            pro: monPro ? monPro.total : 0,
            det: monDet ? monDet.total : 0,
        },
        tue: {
            pro: tuePro ? tuePro.total : 0,
            det: tueDet ? tueDet.total : 0,
        },
        wed: {
            pro: wedPro ? wedPro.total : 0,
            det: wedDet ? wedDet.total : 0,
        },
        thu: {
            pro: thuPro ? thuPro.total : 0,
            det: thuDet ? thuDet.total : 0,
        },
        fri: {
            pro: friPro ? friPro.total : 0,
            det: friDet ? friDet.total : 0,
        },
        sat: {
            pro: satPro ? satPro.total : 0,
            det: satDet ? satDet.total : 0,
        },
        sun: {
            pro: sunPro ? sunPro.total : 0,
            det: sunDet ? sunDet.total : 0,
        },
    };
};

/*
const getDocsData = startWeek => fromEntries( // n1
  Object.entries(startWeek)
    .map(([key, val]) => [key, val ? val.total : "0"])
);

Object.fromEntries does not work in the this version of node (v10.16.3)

Converting an Array to an Object

without fromEntries:
[ [ 'mon', 1 ], [ 'tue', 5 ], [ 'wed', 10 ] ]
with fromEntries:
{ { 'mon', 1 }, { 'tue', 5 }, { 'wed', 10 } }

 */
