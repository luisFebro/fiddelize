import LoadableVisible from "../../../components/code-splitting/LoadableVisible";
// CARD TYPES
// import BirthdaysInWeek from "./types/BirthdaysInWeek";
// import FiddelizeSystem from "./types/FiddelizeSystem";
const AsyncChallenge = LoadableVisible({
    loader: () =>
        import(
            "./types/Challenge" /* webpackChunkName: "challenge-picked-notif-page-lazy" */
        ),
});
const AsyncBirthdayGreeting = LoadableVisible({
    loader: () =>
        import(
            "./types/BirthdayGreeting" /* webpackChunkName: "birthday-greeting-picked-notif-page-lazy" */
        ),
});
const AsyncWelcome = LoadableVisible({
    loader: () =>
        import(
            "./types/Welcome" /* webpackChunkName: "welcome-picked-notif-page-lazy" */
        ),
});
const AsyncAnnouncement = LoadableVisible({
    loader: () =>
        import(
            "./types/Announcement" /* webpackChunkName: "announcement-picked-notif-page-lazy" */
        ),
});
const AsyncProPay = LoadableVisible({
    loader: () =>
        import(
            "./types/ProPay" /* webpackChunkName: "pay-picked-notif-page-lazy" */
        ),
});
const AsyncScore = LoadableVisible({
    loader: () =>
        import(
            "./types/Score" /* webpackChunkName: "score-picked-notif-page-lazy" */
        ),
});
// END CARD TYPES

export default function pickCardType(cardType, options = {}) {
    const {
        content,
        subtype,
        role,
        brief,
        circularImg: mainImg,
        selfBizLogoImg: bizLogo,
        bizName,
        userName,
        senderId,
        updatedBy,
    } = options;

    const defaultProps = { brief, role, mainImg, bizName, userName };

    const chooseBirthday = () => {
        if (subtype === "greeting")
            return (
                <AsyncBirthdayGreeting
                    {...defaultProps}
                    bizLogo={bizLogo}
                    content={content}
                />
            );
        // if (subtype === "weeklyReport")
        // return <BirthdaysInWeek {...defaultProps} />;
        return false;
    };

    const typeList = {
        welcome: <AsyncWelcome {...defaultProps} bizLogo={bizLogo} />,
        challenge: (
            <AsyncChallenge
                {...defaultProps}
                senderId={senderId}
                subtype={subtype}
                content={content}
                updatedBy={updatedBy}
            />
        ),
        system: null,
        birthday: chooseBirthday(),
        pro: (
            <AsyncProPay
                {...defaultProps}
                subtype={subtype}
                content={content || undefined}
            />
        ),
        score: (
            <AsyncScore
                {...defaultProps}
                bizLogo={bizLogo}
                subtype={subtype}
                content={content}
            />
        ),
        announcement: <AsyncAnnouncement mainImg={mainImg} content={content} />,
    };

    const pickComp = () => typeList[cardType];

    return pickComp;
}
