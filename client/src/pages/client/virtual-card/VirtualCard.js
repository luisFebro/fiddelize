import React, { useEffect, useState, Fragment } from "react";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import useData from "../../../hooks/useData";
import useAPI, { readTempScoreList } from "../../../hooks/api/useAPI";
import ReturnBtn from "../../../components/buttons/ReturnBtn";
import { withRouter } from "react-router-dom";
import { useClientAdmin } from "../../../hooks/useRoleData";
import useBackColor from "../../../hooks/useBackColor";
import { setVar } from "../../../hooks/storage/useVar";
// import FlipCreditCard from "../../../components/cards/flip-credit-card/FlipCreditCard";
// Use the 3D card with the flip animation from flipCreditCard.
/*
<FlipCreditCard />
 */

export default withRouter(VirtualCard);

function VirtualCard({ history }) {
    useBackColor("linear-gradient(125deg, #fbd7e5, #bdf4fa)");

    const [data, setData] = useState({
        score: 0,
        createdAt: new Date(),
        loading: true,
        showNoCardMsg: false,
    });
    const { score, createdAt, loading, showNoCardMsg } = data;
    const [name, userId, role] = useData(["name", "userId", "role"]);
    const isCliAdmin = role === "cliente-admin";

    const { selfThemeSColor: sColor } = useClientAdmin();

    const { data: cardsData, error } = useAPI({
        url: readTempScoreList(userId),
        needAuth: true,
        params: { onlyLastAvailable: true },
        trigger: userId !== "...",
    });

    const loadingAll = name === "..." || loading;
    const cond3dCard = !loadingAll && !error && !showNoCardMsg;

    useEffect(() => {
        if (cardsData === false) {
            setData({
                ...data,
                loading: false,
                showNoCardMsg: true,
            });
        }

        if (cardsData && cardsData.tempScore) {
            setData({
                ...data,
                loading: false,
                score: cardsData.tempScore,
                createdAt: new Date(cardsData.createdAt),
            });
        }
    }, [cardsData]);

    const handlePathAndData = () => {
        setVar({ paidValue: score }).then((res) => {
            if (isCliAdmin) {
                history.push("/cliente/pontos-fidelidade?client-admin=1");
            } else {
                history.push("/cliente/pontos-fidelidade");
            }
        });
    };

    const showCard = () => (
        <section className="container-center-col px-2 full-height">
            <main className="animated fadeInUp">
                <ThreeDFlipCard
                    name={name}
                    createdAt={createdAt}
                    score={score}
                />
            </main>
            <div className="animated fadeIn delay-3s mt-5">
                <ButtonFab
                    title="Aplicar pontos"
                    backgroundColor={`var(--themeSDark--${sColor})`}
                    onClick={handlePathAndData}
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
        </section>
    );

    const handleReturnBtn = () => {
        const path = isCliAdmin ? "/mobile-app?client-admin=1" : "/mobile-app";
        history.push(path);
    };

    return (
        <Fragment>
            <ReturnBtn
                onClick={handleReturnBtn}
                icon="arrow-left"
                btnColor={sColor}
            />
            {error && (
                <h2
                    className={`mx-3 text-center full-height container-center text-subtitle font-weight-bold text-black`}
                >
                    Ocorreu um problema de conexão. Tente novamente!
                </h2>
            )}
            {loadingAll && (
                <h2
                    className={`mx-3 text-center full-height container-center text-subtitle font-weight-bold text-black`}
                >
                    Carregando cartão...
                </h2>
            )}
            {cond3dCard && showCard()}
            {!loadingAll && showNoCardMsg && (
                <h1
                    className={`mx-3 text-center full-height container-center text-subtitle font-weight-bold text-black`}
                >
                    Sem cartão com pontos no momento.
                </h1>
            )}
        </Fragment>
    );
}
