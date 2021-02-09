import React from "react";
import { Load } from "../../../components/code-splitting/LoadableComp";
// CARD TYPES
import Welcome from "./types/Welcome";
import FiddelizeSystem from "./types/FiddelizeSystem";
import BirthdayGreeting from "./types/BirthdayGreeting";
import BirthdaysInWeek from "./types/BirthdaysInWeek";
import Challenge from "./types/Challenge";
const AsyncProPay = Load({
    loader: () =>
        import(
            "./types/ProPay" /* webpackChunkName: "pay-picked-notif-page-lazy" */
        ),
});
const AsyncScore = Load({
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
                <BirthdayGreeting
                    {...defaultProps}
                    bizLogo={bizLogo}
                    content={content}
                />
            );
        if (subtype === "weeklyReport")
            return <BirthdaysInWeek {...defaultProps} />;
    };

    const typeList = {
        welcome: <Welcome {...defaultProps} bizLogo={bizLogo} />,
        challenge: (
            <Challenge
                {...defaultProps}
                senderId={senderId}
                subtype={subtype}
                content={content}
                updatedBy={updatedBy}
            />
        ),
        system: (
            <FiddelizeSystem
                {...defaultProps}
                subtype={subtype}
                content={content}
            />
        ),
        birthday: chooseBirthday(),
        pro: (
            <AsyncProPay
                {...defaultProps}
                subtype={subtype}
                content={content ? content : undefined}
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
    };

    const pickComp = () => {
        return typeList[cardType];
    };

    return pickComp;
}
