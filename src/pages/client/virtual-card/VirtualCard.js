import { useEffect, useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import useData from "../../../hooks/useData";
import useAPI, { readTempScoreList } from "../../../hooks/api/useAPI";
import ReturnBtn from "../../../components/buttons/ReturnBtn";
import { useClientAdmin } from "../../../hooks/useRoleData";
import useBackColor from "../../../hooks/useBackColor";
import { setVar, store } from "../../../hooks/storage/useVar";
import usePlayAudio, {
    prerenderAudio,
} from "../../../hooks/media/usePlayAudio";
import getRandomArray from "../../../utils/arrays/getRandomArray";

import Img from "../../../components/Img";
// import FlipCreditCard from "../../../components/cards/flip-credit-card/FlipCreditCard";
// Use the 3D card with the flip animation from flipCreditCard.
/*
<FlipCreditCard />
 */
export default withRouter(VirtualCard);
const isSmall = window.Helper.isSmallScreen();

// text-to-speech
const defaultPath = "/sounds/tts/cli-user-app";
const getTtsStore = ({ isShe, isSmall }) => ({
    newCard: [
        {
            audio: `${defaultPath}/new-card/${
                isSmall ? "mobile" : "desktop"
            }-novos-pontos-exclusivos.mp3`,
            text: isSmall
                ? "Aqui está seus novos pontos do seu cartão virtual exclusivo de fidelidade. Experimente tocar no cartão para interagir"
                : "Aqui está seus novos pontos do seu cartão virtual de fidelidade. Experimente passar o mouse sobre o cartão para interagir",
        },
        {
            audio: `${defaultPath}/new-card/${
                isShe ? "s" : ""
            }he-olha-ai-seu-novo-cartao-d-amig73r.mp3`,
            text: `Olha ai seu novo cartão de fidelidade. E você já pode usar, amig${
                isShe ? "a" : "o"
            }`,
        },
    ],
    noCard: [
        {
            audio: `${defaultPath}/no-card/${
                isShe ? "s" : ""
            }he-cartao-voando-pousa-proxima-compra.mp3`,
            text: `${
                isShe ? "Moça" : "Rapaz"
            }, parece que seu novo cartão de fidelidade está voando por aí. Mas ele vai pousar na sua próxima compra!`,
        },
        {
            audio: `${defaultPath}/no-card/no-card-at-moment.mp3`,
            text: "Nenhum cartão com pontos no momento.",
        },
    ],
});

function getTypeMsg({ noCard }) {
    if (noCard) return "noCard";
    return "newCard";
}

function VirtualCard({ history }) {
    useBackColor("linear-gradient(125deg, #fbd7e5, #bdf4fa)");

    const [data, setData] = useState({
        score: 0,
        createdAt: new Date(),
        loading: true,
        showNoCardMsg: false,
        audioPrerender: false,
    });
    const { score, createdAt, loading, showNoCardMsg, audioPrerender } = data;
    const [name, userId, role, gender] = useData([
        "name",
        "userId",
        "role",
        "gender",
    ]);
    const isShe = gender === "Ela";
    const isCliAdmin = role === "cliente-admin";

    useEffect(() => {
        const runPrerender = async () => {
            const typeMsg = getTypeMsg({
                noCard: showNoCardMsg,
            });

            const selectedArray = getTtsStore({ isShe, isSmall })[typeMsg];
            const { audio, text } = getRandomArray(selectedArray);

            await setVar({ "text_cli-user_virtual-card": text }, store.audios);

            await prerenderAudio(audio, "audio_cli-user_virtual-card");
            setData((prev) => ({ ...prev, audioPrerender: true }));
        };

        if (!loading) runPrerender();
    }, [loading, showNoCardMsg, isShe]);

    const [failureMsg] = useData(["text_cli-user_virtual-card"], {
        storeName: "audios",
        trigger: !loading && audioPrerender,
    });

    const handleFinishedAudio = () => {
        // console.log("the audio ended!!!");
    };

    usePlayAudio(null, "audio_cli-user_virtual-card", {
        autoplay: true,
        onendedCallback: handleFinishedAudio,
        trigger: !loading && audioPrerender,
    });

    const { selfThemeSColor: sColor } = useClientAdmin();

    const { data: cardsData, error } = useAPI({
        url: readTempScoreList(userId),
        needAuth: true,
        params: { onlyLastAvailable: true, isAdmin: isCliAdmin },
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

    const showIllustra = () => (
        <Img
            className="img-fluid"
            src="/img/illustrations/client-no-wing-card.svg"
            offline
            height="auto"
            width="400px"
            alt="sem cartão com pontos"
        />
    );

    return (
        <Fragment>
            <ReturnBtn
                onClick={handleReturnBtn}
                icon="arrow-left"
                btnColor={sColor}
            />
            {error && (
                <h2 className="mx-3 text-center full-height container-center text-subtitle font-weight-bold text-black">
                    Ocorreu um problema de conexão. Tente novamente!
                </h2>
            )}
            {loadingAll && (
                <h2 className="mx-3 text-center full-height container-center text-subtitle font-weight-bold text-black">
                    Carregando cartão...
                </h2>
            )}
            {cond3dCard && showCard()}
            {!loadingAll && showNoCardMsg && (
                <section className="full-page mx-3">
                    {showIllustra()}
                    <h1 className="mt-3 text-left text-subtitle font-weight-bold text-black">
                        {failureMsg}
                    </h1>
                </section>
            )}
        </Fragment>
    );
}
