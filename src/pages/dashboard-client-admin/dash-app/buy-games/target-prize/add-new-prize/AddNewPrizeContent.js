import { useState } from "react";
import getId from "utils/getId";
import TextField from "@material-ui/core/TextField";
// import Field from "components/fields/field";
import CommentField from "components/fields/CommentField";
import showToast from "components/toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import CarouselFlickity from "components/carousels/CarouselFlickity";
import { milestoneIconsSorted } from "global-data/milestoneIconsSorted";
import { pushElemToField } from "api/frequent";
import NumberField from "components/fields/NumberField";
import useData from "init";

const getStyles = () => ({
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "20px",
        fontFamily: "var(--mainFont)",
    },
    fieldFormValueForPts: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "3em",
        zIndex: 2000,
        width: 180,
        padding: 0,
    },
    input: {
        padding: "10px",
    },
});

export default function AddNewPrizeContent({ setTriggerList, closeModal }) {
    const [data, setData] = useState({
        targetPoints: "",
    });
    const { targetPoints } = data;

    const { userId } = useData();

    const [milestoneIcon, setSelectedIcon] = useState("");
    const [prizeDesc, setPrizeDesc] = useState("");

    const styles = getStyles();

    const handleUpdateData = async () => {
        if (!prizeDesc)
            return showToast("Informe alguma descrição para o prêmio", {
                type: "error",
            });

        if (!targetPoints)
            return showToast("Informe algum valor da meta em pontos / PTS", {
                type: "error",
            });

        if (targetPoints <= 0)
            return showToast(
                "Meta em pontos deve ser um número válido maior que zero.",
                { type: "error", dur: 8000 }
            );

        const field = {
            "clientAdminData.games.targetPrize.challList": {
                id: getId(),
                milestoneIcon,
                prizeDesc,
                targetPoints,
            },
        };

        await pushElemToField(userId, "cliente-admin", field);

        showToast("Prêmio adicionado com sucesso!", { type: "success" });
        setTriggerList(getId());
        closeModal();

        return "ok";
    };

    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Novo Prêmio
            </p>
        </div>
    );

    const displayUpdateBtn = () => (
        <section className="mt-5 mb-3 container-center mx-3">
            <ButtonFab
                position="relative"
                onClick={handleUpdateData}
                title="adicionar"
                width="100%"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                fontSize=".9em"
                size="large"
                color="white"
                backgroundColor="var(--themeSDark--default)"
                needBtnShadow={false}
            />
        </section>
    );

    const showIconsCarousel = () => (
        <div>
            <p className="m-0 text-normal text-shadow text-white font-weight-bold">
                Selecione Ícone de Desafio:
            </p>
            <CarouselFlickity
                data={milestoneIconsSorted}
                isFromDash
                setSelectedIcon={setSelectedIcon}
                selectOnlyIcon
                setOpenModal={null}
                currIconInd={0}
                style={{
                    maxWidth: "100%",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                }}
            />
        </div>
    );

    return (
        <section>
            {showTitle()}
            <form className="shadow-elevation new-prize-form text-normal text-white font-weight-bold">
                {showIconsCarousel()}
                <section className="text-shadow">
                    <section className="my-4">
                        <p className="m-0">Meta em pontos:</p>
                        <div className="d-flex">
                            <NumberField
                                type="integer"
                                size="large"
                                placeholder="0"
                                width={150}
                                name="targetPoints"
                                value={targetPoints}
                                onChangeCallback={setData}
                            />
                            <p className="d-inline-block pl-3 text-subtitle">
                                PTS
                            </p>
                        </div>
                    </section>
                    <section className="my-4">
                        <p className="m-0">Prêmio:</p>
                        <CommentField
                            setValue={setPrizeDesc}
                            value={prizeDesc}
                            placeholder="Escreva descrição do prêmio"
                            maxLen={150}
                            maxLenColor="white"
                        />
                    </section>
                </section>
                {displayUpdateBtn()}
                <style jsx>
                    {`
                        .new-prize-form {
                            background: var(--themePLight);
                            border-radius: 10px;
                            padding: 25px 10px;
                        }
                    `}
                </style>
            </form>
        </section>
    );
}

/*
<TextField
    placeholder="0"
    InputProps={{
        style: styles.fieldFormValueForPts,
    }}
    // eslint-disable-next-line
    inputProps={{ style: styles.input }}
    name="targetPoints"
    value={targetPoints}
    type="number"
    variant="outlined"
    onChange={(e) =>
        setData((prev) => ({
            ...prev,
            targetPoints: e.target.value,
        }))
    }
    error={false}
    autoComplete="off"
/>
 */
