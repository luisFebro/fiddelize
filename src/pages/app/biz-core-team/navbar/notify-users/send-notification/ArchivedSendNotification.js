import Title from "../../../../../../components/Title";
import ButtonFab from "../../../../../../components/buttons/material-ui/ButtonFab";

export default function SendNotification({
    usersList,
    whichTab,
    handleShowMessage,
    showMessage,
}) {
    return (
        <section>
            <Title
                title="&#187; Tipo de Notificação"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            <section
                className="container-center"
                style={{
                    marginBottom: 150,
                }}
            >
                <ButtonFab
                    title="Novidades"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={null}
                    position="relative"
                    variant="extended"
                    size="large"
                />
                <div className="ml-5">
                    <ButtonFab
                        title="Bug Fix"
                        backgroundColor="var(--themeSDark--default)"
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            </section>
        </section>
    );
}
