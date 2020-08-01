import React from 'react';
import BubbleTabs from '../../../../components/tabs/bubble-tabs/BubbleTabs';
import Recipients from './Recipients';
import Title from '../../../../components/Title';

export default function RecipientOptions() {
    return (
        <section>
            <Title
                title="&#187; Para quem enviar?"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <BubbleTabs
                firstLabel="Cliente<br />Específico"
                secondLabel="Múltiplos<br/>Clientes"
            />
            <Recipients />
        </section>
    );
}