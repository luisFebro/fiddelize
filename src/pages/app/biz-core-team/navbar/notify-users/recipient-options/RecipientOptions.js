import BubbleTabs from "../../../../../../components/tabs/bubble-tabs/BubbleTabs";
import Title from "../../../../../../components/Title";
import LoadableVisible from "../../../../../../components/code-splitting/LoadableVisible";

const AsyncAllUsersList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./options/AllUsersList" /* webpackChunkName: "all-users-list-push-comp-lazy" */
        ),
});

const AsyncSelectedUsers = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./options/SelectedUsers" /* webpackChunkName: "selected-users-push-comp-lazy" */
        ),
});

export default function RecipientOptions({
    showMessage,
    setWhichTab,
    handleList,
    handleShowMessage,
    handleAppType,
}) {
    const FirstComp = (
        <AsyncAllUsersList
            handleList={handleList}
            handleShowMessage={handleShowMessage}
            handleAppType={handleAppType}
        />
    );
    const SecondComp = (
        <AsyncSelectedUsers
            handleList={handleList}
            handleShowMessage={handleShowMessage}
            handleAppType={handleAppType}
        />
    );

    return (
        <section
            id="recipientOptions"
            className="container-center-max-width-500"
            style={{
                marginBottom: !showMessage ? 150 : undefined,
            }}
        >
            <Title
                title="&#187; Para quem enviar notificações?"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <BubbleTabs
                FirstComp={FirstComp}
                firstLabel="Lista de<br/>Usuários"
                firstName="Lista de Usuários"
                SecondComp={SecondComp}
                secondLabel="Usuários<br />Selecionados"
                secondName="Usuários Selecionados"
                ctaTitle="escrever notificação"
                ctaAction={handleShowMessage}
                setWhichTab={setWhichTab}
            />
        </section>
    );
}
