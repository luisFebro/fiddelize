import React, { useState, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import getFirstName from "../../../../../utils/string/getFirstName";
import MoneyKeyboard from "../../../../../components/keyboards/MoneyKeyboard";
import { convertBrToDollar } from "../../../../../utils/numbers/convertDotComma";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import useData from "../../../../../hooks/useData";
import { prerenderAudio } from "../../../../../hooks/media/usePlayAudio";

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

export default function ScoreCustomer({
    customerName,
    colorP = "purple",
    setCurr,
    textColor,
}) {
    const [score, setScore] = useState("");
    const [fullOpen, setFullOpen] = useState(false);

    const [memberName] = useData(["name"]);

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
        const audio =
            "/sounds/tts/cli-member-app/success-score-addition/certo-tempo-real-cliente.mp3";
        prerenderAudio(audio, "cli-member_msg-score");
        setFullOpen(true);
    };

    const handleSendScores = () => {
        // send notification to cli-user about score
        // set score to a temporary variable in user doc on DB
        setCurr((prev) => ({
            ...prev,
            field: "success",
        }));
    };

    const CustomerBrief = () => (
        <section className="mx-3">
            <h2 className="mb-4 text-purple text-normal font-weight-bold">
                Nome do Cliente:
                <br />
                <span className="text-subtitle">
                    <ul>
                        <li>{cliUserName}.</li>
                    </ul>
                </span>
            </h2>
            <h2 className="mb-4 text-purple text-normal font-weight-bold">
                Cliente recebe no app:
                <br />
                <span className="text-subtitle">
                    <ul>
                        <li>{score} pontos.</li>
                    </ul>
                </span>
            </h2>
            <h2 className="text-purple text-normal font-weight-bold">
                Feito por:
                <br />
                <span className="text-subtitle">
                    <ul>
                        <li>{memberName}.</li>
                    </ul>
                </span>
            </h2>
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
                actionFunc={handleSendScores}
                contentComp={<CustomerBrief />}
                confirmBtnTitle="Tudo Certo!"
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
            />
        </Fragment>
    );
}
