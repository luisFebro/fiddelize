import React from 'react';
// CARD TYPES
import Welcome from './types/Welcome';
import FiddelizeSystem from './types/FiddelizeSystem';
import BirthdayGreeting from './types/BirthdayGreeting';
import BirthdaysInWeek from './types/BirthdaysInWeek';
import Challenge from './types/Challenge';
// END CARD TYPES

export default function pickCardType(cardType, options = {}) {
    const { content, subtype, role, brief } = options;

    const chooseBirthday = () => {
        if(subtype === "greeting") return <BirthdayGreeting />;
        if(subtype === "weeklyReport") return <BirthdaysInWeek />;
    }

    const typeList = {
        welcome: <Welcome brief={brief} role={role} />,
        challenge: <Challenge content={content} />,
        system: <FiddelizeSystem subtype={subtype} />,
        birthday: chooseBirthday(),
    }

    const pickComp = () => {
        return typeList[cardType];
    }

    return pickComp;
}