import Img from "../../../../../components/Img";
import ButtonFab from "../../../../../components/buttons/material-ui/ButtonFab";
import RedirectLink from "../../../../../components/RedirectLink";

export default function AsyncModalContent() {
    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Fiddelize Prêmios
            </p>
        </div>
    );

    const showNoDataIllustra = () =>
        true && ( // needEmptyIllustra && !isOffline
            <div className="container-center my-5">
                <Img
                    src="/img/illustrations/club-pro/empty-admin-prizes.png"
                    mode="skeleton"
                    width="100%"
                    alt="Ilustração prêmios admin"
                    offline
                    title={
                        '<span class="d-inline-block text-subtitle font-weight-bold text-purple">Nenhum prêmio.</span><p class="mx-3 text-normal font-weight-bold text-purple">Acumule pontos e ganhe prêmios da Fiddelize!</p>'
                    }
                />
                <RedirectLink to="/planos?cliente-admin=1">
                    <ButtonFab
                        size="large"
                        title="Começar"
                        onClick={null}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                        position="relative"
                    />
                </RedirectLink>
            </div>
        );

    return (
        <section className="mb-5">
            {showTitle()}
            {showNoDataIllustra()}
        </section>
    );
}
