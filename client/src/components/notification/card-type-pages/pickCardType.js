import React from 'react';
// CARD TYPES
import Welcome from './types/Welcome';
import FiddelizeSystem from './types/FiddelizeSystem';
import BirthdayGreeting from './types/BirthdayGreeting';
import BirthdaysInWeek from './types/BirthdaysInWeek';
import Challenge from './types/Challenge';
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
    } = options;

    const defaultProps = { brief, role, mainImg, bizName, userName };

    const chooseBirthday = () => {
        if(subtype === "greeting") return <BirthdayGreeting {...defaultProps} bizLogo={bizLogo} content={content} />;
        if(subtype === "weeklyReport") return <BirthdaysInWeek {...defaultProps} />;
    }


    const typeList = {
        welcome: <Welcome {...defaultProps} bizLogo={bizLogo} />,
        challenge: <Challenge {...defaultProps} senderId={senderId} subtype={subtype} content={content} />,
        system: <FiddelizeSystem {...defaultProps} subtype={subtype} content={content} />,
        birthday: chooseBirthday(),
    }

    const pickComp = () => {
        return typeList[cardType];
    }

    return pickComp;
}