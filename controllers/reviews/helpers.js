const getFinalGrade = ({ nps, xp }) => {
    if (!nps && !xp) return 5;
    if (nps && !xp) return nps;
    if (!nps && xp) return xp;

    return (nps + xp) / 2;
};

module.exports = getFinalGrade;
