import { useState, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import useData, { useBizData } from "init";
import { setVar } from "init/var";
import getFirstName from "utils/string/getFirstName";
import MoneyKeyboard from "components/keyboards/MoneyKeyboard";
import { convertBrToDollar } from "utils/numbers/convertDotComma";
import { prerenderAudio } from "hooks/media/usePlayAudio";
import getRandomArray from "utils/arrays/getRandomArray";
import getAPI, { addTempPoints } from "api";
import showToast from "components/toasts";

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
            "Certo! Pontos de compra adicionados em tempo real para o cliente",
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
        audio: `${defaultPath}/pontos-de-compra-adicionado-app-cliente-com-sucesso.mp3`,
        text:
            "Pontos de compra foram adicionados no aplicativo do cliente com sucesso!",
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
        userId: data.staffId, // for auth only
        tempPoints: data.tempPoints,
        clientId: data.clientId,
        // notif vars
        bizName: data.bizName,
        bizLogo: data.bizLogo,
        clientName: data.clientName,
        staff: data.staff,
    };

    return await getAPI({
        method: "post",
        url: addTempPoints(),
        body,
    });
};

export default function AddTempPoints({
    customerName,
    colorP = "purple",
    setCurr,
    textColor,
    clientId,
    clientScoreOnly,
    handleCustomerScore,
    closeModal,
}) {
    const [points, setPoints] = useState("");

    const { userId: staffId, name, role } = useData();
    const [staffJob] = useData(["memberJob"], { dots: false });

    const { bizLogo, bizName } = useBizData();

    const cliUserName = getFirstName(customerName && customerName.cap(), {
        addSurname: true,
    });

    const styles = getStyles();

    const handleReturn = () => {
        if (clientScoreOnly) return closeModal();

        setCurr((prev) => ({
            ...prev,
            field: "name",
        }));
    };

    const handleSuccessGame = () => {
        if (clientScoreOnly) {
            const firstCliName = getFirstName(
                customerName && customerName.toLowerCase()
            );
            handleCustomerScore(points, firstCliName);
            closeModal();
            return null;
        }

        if (!clientId) {
            return showToast(
                "Houve um problema ao buscar Id do cliente. Por favor, reinicie.",
                { dur: 3000, type: "error" }
            );
        }

        showToast("Adicionando pontos...", { dur: 4000 });

        (async () => {
            const staff = {
                id: staffId,
                name,
                role,
                job: staffJob,
            };

            const ultimateData = {
                clientId,
                tempPoints: convertBrToDollar(points),
                staffId, // for auth
                // notif vars
                clientName: customerName,
                bizName,
                bizLogo,
                staff,
            };

            const resNewPoints = await setUltimateData(ultimateData);
            if (!resNewPoints) return null;

            return setCurr((prev) => ({
                ...prev,
                field: "success",
            }));
        })();

        return null;
    };

    const handleConfirm = () => {
        (async () => {
            const selectedTTS = getRandomArray(ttsStore);
            const { audio, text } = selectedTTS;

            await Promise.all([
                setVar({ "text_cli-member_msg-score": text }, "audios"),
                setVar({ lastTempPoints: points }),
            ]);

            prerenderAudio(audio, "audio_cli-member_msg-score");

            handleSuccessGame();
        })();
        return null;
    };

    return (
        <Fragment>
            <h1
                className={`animated fadeInUp delay-1s mt-2 mb-1 text-center ${textColor} text-subtitle font-weight-bold`}
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
                    name="points"
                    value={points}
                    variant="outlined"
                    error={false}
                    autoComplete="off"
                    disabled
                />
            </section>
            <MoneyKeyboard
                setDisplay={setPoints}
                display={points}
                colorP={colorP}
                handleReturn={handleReturn}
                handleConfirm={handleConfirm}
            />
        </Fragment>
    );
}
