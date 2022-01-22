import getDayGreetingBr from "utils/getDayGreetingBr";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import ProgressTrack from "./ProgressTrack";

export default function OrderSuccess({ setNextPage, setDefault }) {
    // 3 stages of order: queue, preparing, done
    const currStage = "queue";

    return (
        <section className="text-shadow">
            <h2 className="mt-3 text-center text-subtitle text-white font-weight-bold">
                {getDayGreetingBr()}!
            </h2>
            <ProgressTrack stage={currStage} />
            {currStage === "done" ? (
                <div className="my-5 container-center">
                    <ButtonFab
                        title="Voltar Menu"
                        color="var(--mainWhite)"
                        onClick={() => {
                            setNextPage("menu");
                            setDefault();
                        }}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        size="large"
                    />
                </div>
            ) : (
                <NotifActivationZone />
            )}
            <div style={{ marginBottom: 150 }} />
        </section>
    );
}

// COMP
function NotifActivationZone() {
    return (
        <section className="text-white">
            <p className="text-normal mx-3 my-5 text-center">
                Quer ser notificado quando pedido ficar pronto?
            </p>
            <div className="mt-3 container-center">
                <ButtonFab
                    title="Ativar notificações"
                    color="var(--mainWhite)"
                    onClick={null}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );
}
// END COMP
