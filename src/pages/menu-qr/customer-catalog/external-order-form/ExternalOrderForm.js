import { Fragment, useState, useEffect } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import handleChange from "utils/form/use-state/handleChange";
import ModalFullContent from "components/modals/ModalFullContent";
import showToast from "components/toasts";
import CheckBoxForm from "components/CheckBoxForm";
import Card from "@material-ui/core/Card";
import getItems, { setItems, removeItems } from "init/lStorage";
import autoPhoneMask from "utils/validation/masks/autoPhoneMask";
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";

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

const [
    digitalMenuName,
    digitalMenuPhone,
    digitalMenuCustomerAddress,
] = getItems("global", [
    "digitalMenuName",
    "digitalMenuPhone",
    "digitalMenuCustomerAddress",
]);

export default function ExternalOrderForm({
    sColor = "default",
    isDelivery = true,
    runSuccessOrder,
    setMainData,
}) {
    const [comp, setComp] = useState("main");
    const [fullOpen, setFullOpen] = useState(true);
    const [data, setData] = useState({
        name: "",
        phone: "",
        customerAddress: "",
        errorName: false,
        errorPhone: false,
        errorCustomerAddress: false,
        saveLocalData: true,
    });
    const {
        name,
        phone,
        customerAddress,
        errorName,
        errorPhone,
        errorCustomerAddress,
        saveLocalData,
    } = data;

    const setDefault = () => {
        setData((prev) => ({
            ...prev,
            name: "",
            phone: "",
            customerAddress: "",
        }));
    };

    useEffect(() => {
        if (!digitalMenuName) return;
        setComp("data");
        setData((prev) => ({
            ...prev,
            name: digitalMenuName,
            phone: digitalMenuPhone,
            customerAddress: digitalMenuCustomerAddress,
        }));
    }, [digitalMenuName, digitalMenuPhone, digitalMenuCustomerAddress]);

    const phoneValue = autoPhoneMask(phone);

    const styles = getStyles();

    const switchError = (error) => {
        setData((prev) => ({ ...prev, ...error }));
    };
    const saveOrder = async () => {
        const saveToStorage = () => {
            if (saveLocalData)
                setItems("global", {
                    digitalMenuName: name,
                    digitalMenuPhone: phone,
                    digitalMenuCustomerAddress: customerAddress,
                });
            else
                removeItems("global", [
                    "digitalMenuName",
                    "digitalMenuPhone",
                    "digitalMenuCustomerAddress",
                ]);

            runSuccessOrder({
                customerName: name,
                customerPhone: phone,
                customerAddress,
            });

            return setFullOpen(false);
        };

        if (!name) {
            switchError({ errorName: true });
            return showToast("Informe seu nome", { type: "error" });
        }

        if (!phone) {
            switchError({ errorPhone: true });
            return showToast("Informe contato", { type: "error" });
        }

        if (!customerAddress && isDelivery) {
            switchError({ errorCustomerAddress: true });
            return showToast("Informe endereço", { type: "error" });
        }

        setMainData((prev) => ({
            ...prev,
            customerName: name,
            customerPhone: phone,
            customerAddress,
        }));

        await saveToStorage();
    };

    const showCTA = () => (
        <div className="mt-3 mb-5 container-center">
            <ButtonFab
                title="Concluir pedido"
                backgroundColor={`var(--themeSDark--${sColor})`}
                onClick={saveOrder}
                position="relative"
                variant="extended"
                size="large"
            />
        </div>
    );

    const handleChecked = (status) => {
        setData((prev) => ({ ...prev, saveLocalData: status }));
    };

    const showForm = () => (
        <Fragment>
            <p className="mt-3 text-center text-purple text-subtitle font-weight-bold mx-3">
                Info para {isDelivery ? "entrega" : "busca na loja"}
            </p>
            <form
                style={{ margin: "auto", width: "90%" }}
                className="text-p text-normal"
                onFocus={() =>
                    switchError({
                        errorName: false,
                        errorPhone: false,
                        errorCustomerAddress: false,
                    })
                }
            >
                <div id="field1" className="mt-3">
                    Nome:
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
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                            id: "value2",
                        }}
                    />
                </div>
                <div id="field2" className="mt-3">
                    Celular/Whatsapp
                    <TextField
                        required
                        margin="dense"
                        onChange={handleChange(setData, data)}
                        error={errorPhone}
                        name="phone"
                        value={phoneValue}
                        helperText="Digite com DDD"
                        FormHelperTextProps={{ style: styles.helperFromField }}
                        type="tel"
                        autoComplete="off"
                        fullWidth
                        variant="filled"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneIphoneIcon />
                                </InputAdornment>
                            ),
                            style: styles.fieldForm,
                            id: "value2",
                        }}
                    />
                </div>
                {isDelivery && (
                    <div id="field3" className="mt-3">
                        Endereço:
                        <TextField
                            margin="dense"
                            onChange={handleChange(setData, data)}
                            multiline
                            rows={2}
                            error={errorCustomerAddress}
                            name="customerAddress"
                            placeholder="Rua/Av., Número, Referência"
                            variant="outlined"
                            value={customerAddress}
                            type="text"
                            autoComplete="off"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HomeIcon />
                                    </InputAdornment>
                                ),
                                style: styles.fieldForm,
                                id: "value4",
                            }}
                        />
                    </div>
                )}
                <CheckBoxForm
                    text="Salvar info para próximo pedido"
                    setIsBoxChecked={handleChecked}
                    defaultState
                />
            </form>
            {showCTA()}
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
                <p className="mt-3 text-center text-purple text-subtitle font-weight-bold mx-3">
                    Info para {isDelivery ? "entrega" : "busca pedido na loja"}
                </p>
                <main className="mx-3 text-p text-normal position-relative">
                    <div className="mt-3">
                        <PersonIcon /> Nome:
                        <p className="font-italic">{digitalMenuName}</p>
                    </div>
                    <div className="mt-3">
                        <PhoneIphoneIcon /> Celular/Whatsapp:
                        <p className="font-italic">{digitalMenuPhone}</p>
                    </div>
                    <div className="mt-3">
                        <HomeIcon /> Endereço:
                        <p className="font-italic">
                            {digitalMenuCustomerAddress}
                        </p>
                    </div>
                    <p className="m-0 text-small text-grey">
                        Info salvas do seu último pedido.
                    </p>
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
                                    // remove backend
                                    removeItems("global", [
                                        "digitalMenuName",
                                        "digitalMenuPhone",
                                        "digitalMenuCustomerAddress",
                                    ]);
                                    setDefault();
                                    setComp("main");
                                }}
                            />
                        </div>
                    </div>
                    {showCTA()}
                    <div style={{ marginBottom: 50 }} />
                </main>
            </Card>
        </section>
    );

    return (
        <section>
            {fullOpen && (
                <ModalFullContent
                    contentComp={
                        comp === "data" ? showFilledData() : showForm()
                    }
                    fullOpen={fullOpen}
                    fullScreen={false}
                    setFullOpen={setFullOpen}
                    backgroundColor="var(--mainWhite)"
                />
            )}
        </section>
    );
}
