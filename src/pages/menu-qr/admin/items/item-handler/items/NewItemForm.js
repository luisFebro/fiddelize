import { Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import TextField from "@material-ui/core/TextField";
import handleChange from "utils/form/use-state/handleChange";
import showToast from "components/toasts";
import DeleteButton from "components/buttons/DeleteButton";
import moneyMaskBr from "utils/validation/masks/moneyMaskBr";
import { convertToDollar } from "utils/numbers/convertToReal";
import getId from "utils/getId";
import { useBizData } from "init";
import useContext from "context";

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
    isEditBtn,
}) {
    const {
        finishedUpload,
        itemId,
        adName,
        price,
        img,
        errorAdName,
        errorPrice,
    } = data;
    const { bizId, bizLinkName } = useBizData();
    const { updateItem } = useContext();

    const styles = getStyles();
    const formattedValue = moneyMaskBr(price);
    const randomId = getId();
    const foundItemId = itemId || `item${randomId}`;

    const switchError = (error) => {
        setData((prev) => ({ ...prev, ...error }));
    };
    const saveItem = async () => {
        if (!finishedUpload)
            return showToast(
                "Tente novamente. Caso persista, tente atualizar a foto",
                { type: "error" }
            );
        if (!img) return showToast("Insira imagem do item", { type: "error" });

        if (!adName) {
            switchError({ errorAdName: true });
            return showToast("Informe nome item", { type: "error" });
        }

        if (!price) {
            switchError({ errorPrice: true });
            return showToast("Informe preço", { type: "error" });
        }
        const priceToDB = convertToDollar(formattedValue);

        const newItem = {
            _id: randomId,
            itemId: foundItemId,
            category: "_general",
            adName,
            img,
            adminId: bizId, // from cliAdmin registration
            price: priceToDB,
        };

        const action = isEditBtn ? "update" : "add";
        const dataStatus = updateItem(action, { newItem });
        const status = dataStatus && dataStatus.status;
        const txt = dataStatus && dataStatus.txt;
        if (!status) return showToast(txt, { type: "error" });
        return handleFullClose();
    };

    const showFloatCTA = () => (
        <div
            className="position-fixed animated fadeInUp delay-1s"
            style={{
                bottom: 15,
                right: 15,
            }}
        >
            <section className="container-center">
                {isEditBtn && (
                    <DeleteButton
                        position="relative"
                        bottom={0}
                        right={0}
                        transform="scale(1.1)"
                        onClick={() => {
                            updateItem("delete", {
                                newItem: {
                                    bizId,
                                    adminId: bizId,
                                    type: "delete",
                                    removalItemIds: [foundItemId],
                                },
                                removalImg: {
                                    savedImg: img,
                                    folder: `digital-menu/${bizLinkName}`,
                                },
                            });
                            handleFullClose();
                        }}
                    />
                )}
                <div className="ml-2">
                    <ButtonFab
                        title={isEditBtn ? "Atualizar" : "Salvar"}
                        backgroundColor={`var(--themeSDark--${sColor})`}
                        onClick={saveItem}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </div>
            </section>
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
                        errorAdName: false,
                        errorPrice: false,
                    })
                }
            >
                <div id="field1" className="mx-2 mt-3">
                    <span className="font-weight-bold">Nome Divulgação:</span>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorAdName}
                        name="adName"
                        variant="standard"
                        value={adName}
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
                    <span className="font-weight-bold">Preço R$:</span>
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

    return (
        <section>
            {showForm()}
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
