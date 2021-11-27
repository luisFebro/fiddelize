import LoadableVisible from "../../code-splitting/LoadableVisible";
// CARD TYPES
const AsyncBenefits = LoadableVisible({
    loader: () =>
        import(
            "./types/Benefits" /* webpackChunkName: "cli-user-benefits-notif-page-lazy" */
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

// const AsyncSystem = LoadableVisible({
//     loader: () =>
//         import(
//             "./types/FiddelizeSystem" /* webpackChunkName: "system-picked-notif-page-lazy" */
//         ),
// });

// END CARD TYPES

export default function pickCardType(cardType, options = {}) {
    return () => getCardType(cardType, options);
}

function getCardType(cardType, payload) {
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
    } = payload;

    const defaultProps = { brief, role, mainImg, bizName, userName };

    const handleModalsClose = () => {
        handleFullClose();
        closeNotifModal();
    };

    if (cardType === "welcome") {
        return (
            <AsyncWelcome
                {...defaultProps}
                bizLogo={bizLogo}
                content={content}
            />
        );
    }

    if (cardType === "challenge") {
        return (
            <AsyncBenefits
                {...defaultProps}
                bizLogo={bizLogo}
                bizName={bizName}
                cardId={cardId}
                senderId={senderId}
                subtype={subtype}
                content={content}
                updatedBy={updatedBy}
                handleFullClose={handleModalsClose}
            />
        );
    }

    if (cardType === "birthday") {
        return (
            <AsyncBirthdayGreeting
                {...defaultProps}
                bizLogo={bizLogo}
                content={content}
            />
        );
    }

    if (cardType === "pro") {
        return (
            <AsyncProPay
                {...defaultProps}
                subtype={subtype}
                content={content || undefined}
            />
        );
    }

    if (cardType === "score") {
        return (
            <AsyncScore
                {...defaultProps}
                bizLogo={bizLogo}
                subtype={subtype}
                content={content}
            />
        );
    }

    if (cardType === "announcement") {
        return <AsyncAnnouncement mainImg={mainImg} content={content} />;
    }

    if (cardType === "system") {
        return null;
    }
}
