import { Fragment, useState, useEffect } from "react";
import ModalYesNo from "components/modals/ModalYesNo";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Field from "components/fields";
import validateEmail from "utils/validation/validateEmail";
import showToast from "components/toasts";
import getItems, { setItems, removeItems } from "init/lStorage";
import EditButton from "components/buttons/EditButton";

// save email in the DB

const [loginData] = getItems("global", ["digitalMenuLogin"]);

export default function NotifActivationZone({ socket, ids, bizLinkName }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [data, setData] = useState({
        email: null,
        success: false,
    });
    const { email, success } = data;
    const digitalMenuLogin = loginData[bizLinkName];

    const updateDbEmail = (thisData) => {
        const dataEmail = {
            ...ids,
            customerEmail: thisData,
        };
        if (socket) socket.emit("updateCustomerOrder", dataEmail);
    };

    useEffect(() => {
        if (digitalMenuLogin) {
            setData((prev) => ({
                ...prev,
                email: digitalMenuLogin,
                success: true,
            }));
            updateDbEmail(digitalMenuLogin);
        }
    }, [digitalMenuLogin]);

    const toggleCustomerEmail = () => {
        if (success || digitalMenuLogin) {
            // remove email in the DB
            updateDbEmail(null);
            setData((prev) => ({ ...prev, email: null, success: false }));
            setFullOpen(false);
            removeItems("global", ["digitalMenuLogin"]);
            return showToast("Notificação desativada e email removido", {
                type: "success",
            });
        }

        const isValidEmail = validateEmail(email);
        if (!isValidEmail)
            return showToast("Email informado é invalido. Tente novamente.", {
                type: "error",
            });

        updateDbEmail(email);
        setItems("global", { digitalMenuLogin: email });
        setData({ email, success: true });
        setFullOpen(false);
        showToast("Notificação ativada", { type: "success" });
        // save email in the DB
    };

    const FieldZone = () => (
        <section className="mb-5">
            <Field
                textAlign="text-left"
                size="medium"
                name="email"
                variant="filled"
                value={email}
                onChangeCallback={setData}
                autoFocus
            />
            <div className="mt-5 container-center">
                <ButtonFab
                    title="Voltar"
                    position="relative"
                    color="var(--mainWhite)"
                    onClick={() => setFullOpen(false)}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="small"
                />
                <div className="ml-3">
                    <ButtonFab
                        title={success ? "Desativar" : "Ativar"}
                        position="relative"
                        color="var(--mainWhite)"
                        onClick={toggleCustomerEmail}
                        backgroundColor={
                            success
                                ? "var(--expenseRed)"
                                : "var(--themeSDark--default)"
                        }
                        variant="extended"
                        size="large"
                    />
                </div>
            </div>
        </section>
    );

    const showMain = () => (
        <Fragment>
            <p className="text-normal mx-3 my-5 text-center">
                Quer ser notificado em tempo real sobre seu pedido?
            </p>
            <div className="mt-3 container-center">
                <ButtonFab
                    title="Ativar notificação"
                    color="var(--mainWhite)"
                    onClick={() => setFullOpen(true)}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    size="large"
                />
            </div>
        </Fragment>
    );

    const showEmailOnZone = () => (
        <section className="position-relative mx-3 text-normal text-center text-white text-shadow my-5">
            <h2 className="text-subtitle">Ativado notificação para:</h2>
            <p className="font-weight-bold">{email || digitalMenuLogin}</p>
            <div
                className="d-none position-absolute"
                style={{
                    bottom: "-30px",
                    right: "10px",
                }}
            >
                <EditButton onClick={() => setFullOpen(true)} zIndex=" " />
            </div>
        </section>
    );

    return (
        <section className="text-white">
            {success ? showEmailOnZone() : showMain()}
            {fullOpen && (
                <ModalYesNo
                    title="Informe seu email:"
                    subTitle=""
                    fullOpen={fullOpen}
                    setFullOpen={setFullOpen}
                    actionFunc={null}
                    needIndex
                    needCTAs={false}
                    contentComp={<FieldZone />}
                />
            )}
        </section>
    );
}
