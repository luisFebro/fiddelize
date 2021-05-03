import { useEffect, useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import ThreeDFlipCard from "../../../components/cards/3d-flip-card/ThreeDFlipCard";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import useData from "init";
import useAPI, { readTempPointsList } from "../../../hooks/api/useAPI";
import ReturnBtn from "../../../components/buttons/ReturnBtn";
import { useBizData } from "init";
import useBackColor from "../../../hooks/useBackColor";
import { setVar } from "init/var";
import usePlayAudio, {
    prerenderAudio,
} from "../../../hooks/media/usePlayAudio";
import getRandomArray from "../../../utils/arrays/getRandomArray";
import Img from "../../../components/Img";
import getDayGreetingBr from "../../../utils/getDayGreetingBr";

export default withRouter(VirtualCard);

// text-to-speech
const defaultPath = "/sounds/tts/cli-user-app";
const getTtsStore = ({ isShe }) => ({
    newCard: [
        {
            audio: `${defaultPath}/new-card/${getDayGreeting()}-oba-novo-cartao-de-compra-exclusivo-com-pontos.mp3`,
            text:
                "Oba! Aqui está seu novo cartão de compra exclusivo com pontos. Tenha um bom dia e volte sempre!",
        },
        {
            audio: `${defaultPath}/new-card/${
                isShe ? "s" : ""
            }he-olha-ai-seu-novo-cartao-d-amig.mp3`,
            text: `Olha ai seu novo cartão de fidelidade. E você já pode usar, amig${
                isShe ? "a" : "o"
            }`,
        },
        {
            audio: `${defaultPath}/new-card/${
                isShe ? "s" : ""
            }he-novo-cartao-preferencia.mp3`,
            text: `${
                isShe ? "Querida, " : "Meu caro, "
            } aqui está seu novo cartão de compra. Obrigada por sua preferência!`,
        },
    ],
    noCard: [
        {
            audio: `${defaultPath}/no-card/${
                isShe ? "s" : ""
            }he-cartao-voando-pousa-proxima-compra.mp3`,
            text: `${
                isShe ? "Moça" : "Rapaz"
            }, parece que seu novo cartão está voando por aí. Mas ele vai pousar na sua próxima compra!`,
        },
        {
            audio: `${defaultPath}/no-card/no-card-at-moment.mp3`,
            text: "Nenhum cartão de compra com pontos no momento.",
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
    const [name, userId, role, sexLetter] = useData([
        "name",
        "userId",
        "role",
        "sexLetter",
    ]);
    const isShe = sexLetter === "a";
    const isCliAdmin = role === "cliente-admin";

    useEffect(() => {
        const runPrerender = async () => {
            const typeMsg = getTypeMsg({
                noCard: showNoCardMsg,
            });

            const selectedArray = getTtsStore({ isShe })[typeMsg];
            const { audio, text } = getRandomArray(selectedArray);

            await setVar({ "text_cli-user_virtual-card": text }, "audios");

            await prerenderAudio(audio, "audio_cli-user_virtual-card");
            setData((prev) => ({ ...prev, audioPrerender: true }));
        };

        if (!loading) runPrerender();
    }, [loading, showNoCardMsg, isShe]);

    const [failureMsg] = useData(["text_cli-user_virtual-card"], {
        store: "audios",
        trigger: !loading && audioPrerender,
    });

    const showTitle = () => (
        <div className="mt-3 text-center text-purple mx-3">
            <h1 className="text-subtitle font-weight-bold">Cartão</h1>
            <h2
                className="text-normal"
                style={{
                    lineHeight: "25px",
                }}
            >
                A cada compra, você ganha um novo cartão com pontos.
            </h2>
        </div>
    );

    const handleFinishedAudio = () => {
        // console.log("the audio ended!!!");
    };

    usePlayAudio(null, "audio_cli-user_virtual-card", {
        autoplay: true,
        onendedCallback: handleFinishedAudio,
        trigger: !loading && audioPrerender,
    });

    const { themeSColor: sColor } = useBizData();

    const { data: cardsData, error } = useAPI({
        url: readTempPointsList(userId),
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

        if (cardsData && cardsData.tempPoints) {
            setData({
                ...data,
                loading: false,
                score: cardsData.tempPoints,
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
        <section className="container-center-col px-2 mt-5">
            <main className="animated fadeInUp">
                <ThreeDFlipCard
                    name={name}
                    createdAt={createdAt}
                    score={score}
                />
            </main>
            <div className="animated fadeIn delay-3s mt-5">
                <ButtonFab
                    disabled={false}
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
            {showTitle()}
            {error && (
                <h2
                    className="mx-3 text-center container-center text-subtitle font-weight-bold text-purple"
                    style={{
                        marginTop: 150,
                    }}
                >
                    Ocorreu um problema de conexão. Tente novamente!
                </h2>
            )}
            {loadingAll && (
                <h2
                    className="mx-3 text-center container-center text-subtitle font-weight-bold text-purple"
                    style={{
                        marginTop: 150,
                    }}
                >
                    Carregando cartão...
                </h2>
            )}
            {cond3dCard && showCard()}
            {!loadingAll && showNoCardMsg && (
                <section className="mt-4 mx-3">
                    {showIllustra()}
                    <h1 className="mt-3 text-left text-purple text-normal font-weight-bold">
                        {failureMsg}
                    </h1>
                </section>
            )}
            <ReturnBtn
                onClick={handleReturnBtn}
                icon="arrow-left"
                btnColor={sColor}
                style={{
                    bottom: 55,
                    left: 15,
                }}
            />
        </Fragment>
    );
}

// HELPERS
function getDayGreeting() {
    const greeting = getDayGreetingBr();
    if (!greeting) return;

    if (greeting.includes("tarde")) return "tarde";
    if (greeting.includes("noite")) return "noite";
    if (greeting.includes("madru")) return "madrugada";

    return "dia";
}

/* ARCHIVES
{blockAccess && !loadingAccess && (
    <p className="text-center text-normal mx-3 my-3">
        {name}, reinicie seu app para atualizar sua pontuação.
    </p>
)}


const triggerAccess = !loadingAll && !showNoCardMsg;
const { blockAccess, loadingAccess } = useAccessChecker(
    userId,
    totalPurchasePrize,
    triggerAccess
);

// if user does not have the same quantity of prize in the db and thus not updateed
// then, block access to user's score panel to avoid registration of accumulative score from the last challenge.
function useAccessChecker(userId, totalPrize, trigger) {
    const [blockAccess, setBlockAccess] = useState(false); // null
    const [loadingAccess, setLoadingAccess] = useState(true);

    useEffect(() => {
        let cancel;
        if (cancel || !trigger) return;

        (async () => {
            const res = await getAPI({
                url: readUser(userId, "cliente", false),
                params: {
                    select: "clientUserData.totalPurchasePrize",
                },
            });

            if (res.status !== 200) {
                console.log(
                    "smt wrong with readUser from block access checker"
                );
                return;
            }
            const totaldBPrizes =
                res.data.clientUserData &&
                res.data.clientUserData.totalPurchasePrize;
            if (totaldBPrizes !== totalPrize) setBlockAccess(true);
            else setBlockAccess(false);

            setLoadingAccess(false);
            return;
        })();

        return () => (cancel = true);
    }, [trigger, userId, totalPrize]);

    return { blockAccess, loadingAccess };
}

*/
