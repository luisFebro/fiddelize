import { useState, useEffect } from "react";
import getId from "utils/getId";
import TextField from "@material-ui/core/TextField";
import Field from "components/fields/field";
import CommentField from "components/fields/CommentField";
import showToast from "components/toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";

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

export default function AddNewPrizeContent({ setTriggerList }) {
    const [data, setData] = useState({
        id: "",
        milestoneIcon: "",
        targetPoints: 0,
        prizeDesc: "",
    });
    const { id, milestoneIcon, targetPoints, prizeDesc } = data;

    const styles = getStyles();

    useEffect(() => {
        setData((prev) => ({ ...prev, id: getId() }));
    }, []);

    const handleUpdateData = () => {
        if (targetPoints <= 0)
            showToast(
                "Meta em pontos deve ser um número válido maior que zero.",
                { type: "error", dur: 8000 }
            );
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

    return (
        <section>
            {showTitle()}
            <form className="shadow-elevation new-prize-form">
                <p className="text-shadow text-normal text-white font-weight-bold">
                    Meta em pontos:
                </p>
                <TextField
                    placeholder="0"
                    InputProps={{
                        style: styles.fieldFormValueForPts,
                    }}
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
