import { useState, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import getFirstName from "../../../../../utils/string/getFirstName";
import MoneyKeyboard from "../../../../../components/keyboards/MoneyKeyboard";
import { convertBrToDollar } from "../../../../../utils/numbers/convertDotComma";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import useData from "init";
import { setVar } from "init/var";
import { prerenderAudio } from "../../../../../hooks/media/usePlayAudio";
import getRandomArray from "../../../../../utils/arrays/getRandomArray";
import getAPI, {
    setTempScoreAndMemberData,
} from "../../../../../utils/promises/getAPI";
import showToast from "../../../../../components/toasts";
import { useBizData } from "init";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "3em",
        zIndex: 2000,
        width: 270,
        padding: 0,
    },
    input: {
        padding: "10px",
    },
});

// text-to-speech
const defaultPath = "/sounds/tts/cli-member-app/success-score-addition";
const ttsStore = [
    {
        audio: `${defaultPath}/certo-tempo-real-cliente.mp3`,
        text:
            "Certo! Pontos de fidelidade adicionados em tempo real para o cliente",
    },
    {
        audio: `${defaultPath}/finalizado-pontos-disponivel-app-cliente.mp3`,
        text:
            "Finalizado! Pontos já disponíveis no aplicativo do cliente. Obrigada!",
    },
    {
        audio: `${defaultPath}/mais-pontos-adicionados-para-cliente-ate-logo.mp3`,
        text: "Mais pontos adicionados para o cliente. Até logo!",
    },
    {
        audio: `${defaultPath}/pontos-adicionados-e-ja-disponiveis-app-cliente.mp3`,
        text: "Pontos adicionados e já disponíveis no aplicativo do cliente.",
    },
    {
        audio: `${defaultPath}/pontos-creditados-para-o-cliente-obrigada-por-voltar.mp3`,
        text: "Pontos creditados para o cliente. Obrigada por voltar!",
    },
    {
        audio: `${defaultPath}/pontos-de-fidelidade-adicionado-app-cliente-com-sucesso.mp3`,
        text:
            "Pontos de fidelidade adicionados no aplicativo do cliente com sucesso!",
    },
    {
        audio: `${defaultPath}/pontos-enviados-com-sucesso-obrigada-por-adicionar.mp3`,
        text: "Pontos enviados com sucesso. Obrigada por adicionar!",
    },
    {
        audio: `${defaultPath}/rapido-hein-conta-do-cliente.mp3`,
        text:
            "Rápido, hein?! Os pontos já foram enviados para a conta do cliente. Até logo!",
    },
    {
        audio: `${defaultPath}/tava-esperando-aqui-ate-proxima.mp3`,
        text:
            "Tava esperando aqui... Já enviei os pontos para o cliente. Até a próxima!",
    },
    {
        audio: `${defaultPath}/tudo-certo-pontos-enviados-para-o-cliente.mp3`,
        text: "Tudo certo! Pontos enviados com sucesso para o cliente.",
    },
];

const setUltimateData = async (data) => {
    const body = {
        userId: data.memberId, // for auth only
        bizId: data.bizId,
        bizName: data.bizName,
        bizLogo: data.bizLogo,
        clientId: data.clientId,
        clientName: data.clientName,
        memberId: data.memberId,
        tempScore: data.tempScore,
    };

    return await getAPI({
        method: "post",
        url: setTempScoreAndMemberData(),
        body,
    });
};

export default function ScoreCustomer({
    customerName,
    colorP = "purple",
    setCurr,
    textColor,
    bizId,
    clientId,
    clientScoreOnly,
    handleCustomerScore,
    closeModal,
}) {
    const [score, setScore] = useState("");
    const [fullOpen, setFullOpen] = useState(false);

    const [memberName, memberId, role] = useData(["name", "userId", "role"]);
    const { bizLogo, bizName } = useBizData();

    const cliUserName = getFirstName(customerName && customerName.cap(), {
        addSurname: true,
    });

    const styles = getStyles();

    const handleReturn = () => {
        setCurr((prev) => ({
            ...prev,
            field: "name",
        }));
    };

    const handleConfirm = () => {
        (async () => {
            const selectedTTS = getRandomArray(ttsStore);
            const { audio, text } = selectedTTS;

            await setVar({ "text_cli-member_msg-score": text }, "audios");

            prerenderAudio(audio, "audio_cli-member_msg-score");
            setFullOpen(true);
        })();
    };

    const handleSuccessScore = () => {
        if (memberId === "..." || !bizName) return;

        if (clientScoreOnly) {
            const firstCliName = getFirstName(
                customerName && customerName.toLowerCase()
            );
            handleCustomerScore(score, firstCliName);
            setFullOpen(false);
            closeModal();
            return;
        }

        if (!clientId) {
            showToast(
                "Houve um problema ao buscar Id do cliente. Por favor, reinicie.",
                { dur: 3000, type: "error" }
            );
        }

        showToast("Adicionando...", { dur: 5500 });
        (async () => {
            const ultimateData = {
                clientId,
                clientName: customerName,
                tempScore: convertBrToDollar(score),
                memberId,
                bizId,
                bizName,
                bizLogo,
            };
            const resNewScore = await setUltimateData(ultimateData).catch(
                (e) => {
                    if (e.error && e.error.includes("pontuação pendente")) {
                        showToast(e.error, { dur: 10000, type: "error" });
                        setTimeout(() => {
                            showToast("Reiniciando...");
                            const isCliAdmin = role === "cliente-admin";
                            if (isCliAdmin)
                                window.location.href = "/mobile-app";
                            else window.location.href = "/t/app/equipe";
                        }, 11000);
                    }

                    return false;
                }
            );
            if (!resNewScore) return;

            setCurr((prev) => ({
                ...prev,
                field: "success",
            }));
        })();
    };

    const CustomerBrief = () => (
        <section className="mx-3">
            <h2 className="mb-3 text-purple text-normal font-weight-bold">
                Nome do Cliente:
                <br />
                <span className="text-subtitle">
                    <ul>
                        <li>{cliUserName}.</li>
                    </ul>
                </span>
            </h2>
            <h2 className="mb-3 text-purple text-normal font-weight-bold">
                Cliente recebe:
                <br />
                <span className="text-subtitle">
                    <ul>
                        <li>{score} pontos.</li>
                    </ul>
                </span>
            </h2>
            {!clientScoreOnly && (
                <h2 className="text-purple text-normal font-weight-bold">
                    Feito por:
                    <br />
                    <span className="text-subtitle">
                        <ul>
                            <li>{memberName}.</li>
                        </ul>
                    </span>
                </h2>
            )}
        </section>
    );

    return (
        <Fragment>
            <h1
                className={`animated fadeInUp delay-1s mt-4 mb-3 text-center ${textColor} text-subtitle font-weight-bold`}
            >
                <span className="text-em-1-3 d-block">
                    Cliente:
                    <br />
                    {cliUserName}
                </span>
                Quanto foi a compra?
            </h1>
            <section className="animated slideInRight container-center">
                <TextField
                    placeholder="0,00"
                    InputProps={{
                        style: styles.fieldFormValue, // alignText is not working here... tried input types and variations
                    }}
                    inputProps={{ style: styles.input }}
                    name="score"
                    value={score}
                    variant="outlined"
                    error={false}
                    autoComplete="off"
                    disabled
                />
            </section>
            <MoneyKeyboard
                setDisplay={setScore}
                display={score}
                colorP={colorP}
                handleReturn={handleReturn}
                handleConfirm={handleConfirm}
            />
            <ModalConfirmation
                title="Confira o Resumo"
                actionFunc={handleSuccessScore}
                contentComp={<CustomerBrief />}
                confirmBtnTitle="Tudo Certo!"
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </Fragment>
    );
}
