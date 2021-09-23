import LoadableVisible from "../../code-splitting/LoadableVisible";
import { useBizData } from "init";
// CARD TYPES
const AsyncCliUserConfirmedChall = LoadableVisible({
    loader: () =>
        import(
            "./types/CliUserConfirmedChall" /* webpackChunkName: "cli-user-conf-challenge-picked-notif-page-lazy" */
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
        cardId,
        content,
        subtype,
        role,
        brief,
        circularImg: mainImg,
        bizLogo,
        userName,
        bizName,
        senderId,
        updatedBy,
        handleFullClose,
        closeNotifModal,
    } = options;

    const defaultProps = { brief, role, mainImg, bizName, userName };

    const handleModalsClose = () => {
        handleFullClose();
        closeNotifModal();
    };

    const typeList = {
        welcome: (
            <AsyncWelcome
                {...defaultProps}
                bizLogo={bizLogo}
                content={content}
            />
        ),
        challenge: (
            <AsyncCliUserConfirmedChall
                {...defaultProps}
                bizLogo={bizLogo}
                cardId={cardId}
                senderId={senderId}
                subtype={subtype}
                content={content}
                updatedBy={updatedBy}
                handleFullClose={handleModalsClose}
            />
        ),
        system: null,
        birthday: (
            <AsyncBirthdayGreeting
                {...defaultProps}
                bizLogo={bizLogo}
                content={content}
            />
        ),
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
