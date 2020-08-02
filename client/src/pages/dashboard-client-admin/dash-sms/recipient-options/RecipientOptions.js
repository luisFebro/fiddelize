import React from 'react';
import BubbleTabs from '../../../../components/tabs/bubble-tabs/BubbleTabs';
import Title from '../../../../components/Title';
import LoadableVisible from '../../../../components/code-splitting/LoadableVisible';

const AsyncAllCustomers = LoadableVisible({ loading: true, loader: () => import('./options/AsyncAllCustomers'  /* webpackChunkName: "all-customers-comp-sms-lazy" */ )});
const AsyncSpecificCustomer = LoadableVisible({ loading: true, loader: () => import('./options/AsyncSpecificCustomer'  /* webpackChunkName: "specific-customer-comp-sms-lazy" */ )});

export default function RecipientOptions() {
    const FirstComp = <AsyncAllCustomers />
    const SecondComp = <AsyncSpecificCustomer />

    return (
        <section>
            <Title
                title="&#187; Para quem enviar?"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <BubbleTabs
                FirstComp={FirstComp}
                firstLabel="Múltiplos<br/>Clientes"
                SecondComp={SecondComp}
                secondLabel="Cliente<br />Específico"
                ctaTitle="colocar mensagem"
            />
        </section>
    );
}