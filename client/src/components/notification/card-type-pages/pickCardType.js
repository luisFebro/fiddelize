import React from 'react';
// CARD TYPES
import Welcome from './types/Welcome';
import FiddelizeSystem from './types/FiddelizeSystem';
import BirthdayGreeting from './types/BirthdayGreeting';
import BirthdaysInWeek from './types/BirthdaysInWeek';
import ClientWonChall from './types/ClientWonChall';
// END CARD TYPES

export default function pickCardType(cardType) {
    const typeList = {
        welcome: <Welcome />,
        birthdayGreeting: <BirthdayGreeting />,
        birthdaysInWeek: <BirthdaysInWeek />,
        clientWonChall: <ClientWonChall />,
        system: <FiddelizeSystem />,
    }

    const pickComp = () => {
        return typeList[cardType];
    }

    return pickComp;
}