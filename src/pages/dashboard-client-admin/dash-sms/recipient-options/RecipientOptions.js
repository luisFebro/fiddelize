import BubbleTabs from "../../../../components/tabs/bubble-tabs/BubbleTabs";
import Title from "../../../../components/Title";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

const AsyncAllCustomers = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./options/AsyncAllCustomers" /* webpackChunkName: "all-customers-comp-sms-lazy" */
        ),
});
const AsyncSpecificCustomer = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./options/AsyncSpecificCustomer" /* webpackChunkName: "specific-customer-comp-sms-lazy" */
        ),
});

export default function RecipientOptions({
    setWhichTab,
    handleList,
    handleShowMessage,
}) {
    const FirstComp = (
        <AsyncAllCustomers
            handleList={handleList}
            handleShowMessage={handleShowMessage}
        />
    );
    const SecondComp = (
        <AsyncSpecificCustomer
            handleList={handleList}
            handleShowMessage={handleShowMessage}
        />
    );

    return (
        <section
            id="recipientOptions"
            className="container-center-max-width-500"
        >
            <Title
                title="&#187; Para quem enviar?"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <BubbleTabs
                FirstComp={FirstComp}
                firstLabel="Lista de<br/>Clientes"
                firstName="Lista de Clientes"
                SecondComp={SecondComp}
                secondLabel="Contatos<br />Selecionados"
                secondName="Contatos Selecionados"
                ctaTitle="colocar mensagem"
                ctaAction={handleShowMessage}
                setWhichTab={setWhichTab}
            />
        </section>
    );
}
