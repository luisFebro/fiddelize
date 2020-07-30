import React from 'react';
import BubbleTabs from '../../../../components/tabs/bubble-tabs/BubbleTabs';
import Recipients from './Recipients';

export default function RecipientOptions() {
    return (
        <section>
            <BubbleTabs />
            <Recipients />
        </section>
    );
}