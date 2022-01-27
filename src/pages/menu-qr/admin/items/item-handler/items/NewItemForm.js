import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import showToast from "components/toasts";
import Card from "@material-ui/core/Card";
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";
import { convertToDollar } from "utils/numbers/convertToReal";
import getId from "utils/getId";
import { useBizData } from "init";

const isSmall = window.Helper.isSmallScreen();

const getStyles = () => ({
    fieldForm: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        // zIndex: 2000,
        font: "normal 1em Poppins, sans-serif",
    },
    helperFromField: {
        color: "grey",
        fontFamily: "Poppins, sans-serif",
        fontSize: isSmall ? ".8em" : ".6em",
    },
});

export default function NewItemForm({
    sColor = "default",
    setData,
    data,
    handleFullClose,
    updateItem,
}) {
    const [comp, setComp] = useState("main");
    const { name, price, img, errorName, errorPrice } = data;
    const { bizId } = useBizData();

    const styles = getStyles();
    const formattedValue = moneyMaskBr(price);

    const switchError = (error) => {
        setData((prev) => ({ ...prev, ...error }));
    };
    const saveItem = async () => {
        if (!img) {
            return showToast("Insira imagem do item", { type: "error" });
        }

        if (!name) {
            switchError({ errorName: true });
            return showToast("Informe nome item", { type: "error" });
        }

        if (!price) {
            switchError({ errorPrice: true });
            return showToast("Informe preço", { type: "error" });
        }
        const priceToDB = convertToDollar(formattedValue);

        const randomId = getId();
        const newItem = {
            _id: randomId,
            category: "_general",
            adName: name,
            img,
            adminId: bizId, // from cliAdmin registration
            price: priceToDB,
        };

        const dataStatus = updateItem("add", { newItem });
        const status = dataStatus && dataStatus.status;
        const txt = dataStatus && dataStatus.txt;
        if (!status) return showToast(txt, { type: "error" });
        return handleFullClose();
    };

    const showFloatCTA = () => (
        <div
            className="position-fixed animated fadeInUp delay-2s"
            style={{
                bottom: 15,
                right: 15,
            }}
        >
            <ButtonFab
                title="Salvar"
                backgroundColor={`var(--themeSDark--${sColor})`}
                onClick={saveItem}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );

    const showForm = () => (
        <Fragment>
            <form
                style={{
                    margin: "auto",
                    width: "100%",
                    backgroundColor: "var(--mainWhite)",
                    color: "var(--themeP)",
                }}
                className="text-p text-normal py-3"
                onFocus={() =>
                    switchError({
                        errorName: false,
                        errorPrice: false,
                    })
                }
            >
                <div id="field1" className="mx-2 mt-3">
                    Nome Divulgação:
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorName}
                        name="name"
                        variant="standard"
                        value={name}
                        type="text"
                        autoComplete="off"
                        fullWidth
                        InputProps={{
                            style: styles.fieldForm,
                            id: "value4",
                        }}
                    />
                </div>
                <div id="field2" className="mx-2 mt-3">
                    Preço R$:
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorPrice}
                        name="price"
                        value={formattedValue}
                        type="tel"
                        autoComplete="off"
                        fullWidth
                        variant="standard"
                        InputProps={{
                            style: styles.fieldForm,
                        }}
                    />
                </div>
                <div style={{ marginBottom: 100 }} />
            </form>
        </Fragment>
    );

    const showFilledData = () => (
        <section
            style={{
                overflowY: "scroll",
            }}
        >
            <Card
                className="mb-3"
                style={{
                    margin: "auto",
                    boxShadow: "0 31px 120px -6px rgba(0, 0, 0, 0.35)",
                    width: "90%",
                    // maxWidth: isSmall ? "" : 360,
                }}
            >
                <main className="mx-3 text-p text-normal position-relative">
                    <div className="mt-3">
                        Nome Divulgação:
                        <p className="font-italic">{name}</p>
                    </div>
                    <div className="mt-3">
                        Preço R$:
                        <p className="font-italic">{price}</p>
                    </div>
                    <div className="container-center">
                        <EditButton
                            position="relative"
                            bottom={0}
                            right={0}
                            transform="scale(0.9)"
                            onClick={() => {
                                setComp("main");
                            }}
                        />
                        <div className="ml-1">
                            <DeleteButton
                                position="relative"
                                bottom={0}
                                right={0}
                                transform="scale(1.1)"
                                onClick={() => {
                                    setDefault();
                                    setComp("main");
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 100 }} />
                </main>
            </Card>
        </section>
    );

    return (
        <section>
            {comp === "data" ? showFilledData() : showForm()}
            {showFloatCTA()}
        </section>
    );
}

/*
<div id="field3" className="mx-2 mt-3">
    Descrição (opcional):
    <TextField
        margin="dense"
        onChange={handleChange(setData, data)}
        multiline
        rows={2}
        error={false}
        name="desc"
        variant="outlined"
        value={desc}
        type="text"
        autoComplete="off"
        fullWidth
        InputProps={{
            style: styles.fieldForm,
        }}
    />
</div>
<div id="field3" className="mx-2 mt-3">
    Quantidade Disponível (opcional):
    <TextField
        margin="dense"
        onChange={handleChange(setData, data)}
        error={false}
        name="qtt"
        variant="outlined"
        value={qtt}
        type="number"
        autoComplete="off"
        InputProps={{
            style: { ...styles.fieldForm, width: 100 },
        }}
    />
</div>
 */
