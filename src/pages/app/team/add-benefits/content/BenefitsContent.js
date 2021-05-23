import { useState } from "react";
import { useBizData } from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncPendingBenefitsList = Load({
    loader: () =>
        import(
            "./PendingBenefitsList" /* webpackChunkName: "pending-benefits-page-lazy" */
        ),
});

const AsyncDoneBenefitsList = Load({
    loader: () =>
        import(
            "./DoneBenefitsList" /* webpackChunkName: "done-benefits-page-lazy" */
        ),
});

export default function BenefitsContent() {
    const [content, setContent] = useState("pendingBenefits"); // doneBenefits
    const isPending = content === "pendingBenefits";

    const { themeSColor } = useBizData();

    const showTitleAndSub = () => (
        <div
            className={`mt-3 ${
                !isPending && "pb-3"
            } text-center text-purple mx-3`}
        >
            <h1 className="text-subtitle font-weight-bold">
                Benefícios da
                <br />
                clientela
            </h1>
            <h2
                className="text-normal"
                style={{
                    lineHeight: "25px",
                }}
            >
                Todos {isPending && " os clientes aptos a receber "} benefícios{" "}
                {!isPending && " recebidos pelos clientes "} aparecem
                {isPending && " automaticamente "} aqui.
            </h2>
        </div>
    );

    const showContentSwitcher = () => (
        <section className="my-4">
            <div className="d-flex justify-content-end mr-3">
                <ButtonFab
                    size="large"
                    title={isPending ? "VER FEITOS" : "VER PENDENTES"}
                    backgroundColor={`var(--themeSDark--${themeSColor})`}
                    onClick={() =>
                        setContent(isPending ? "history" : "pendingBenefits")
                    }
                    position="relative"
                    variant="extended"
                />
            </div>
        </section>
    );

    return (
        <section className="text-purple">
            {showTitleAndSub()}
            {showContentSwitcher()}
            {isPending ? (
                <AsyncPendingBenefitsList />
            ) : (
                <AsyncDoneBenefitsList />
            )}
        </section>
    );
}
