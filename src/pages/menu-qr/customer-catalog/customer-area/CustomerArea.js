import { Fragment, useState, useEffect } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { removeItems } from "init/lStorage";
import showToast from "components/toasts";
import useContext from "context";
import CustomerPanelBtn from "./customer-panel/CustomerPanelBtn";
// import getDayGreetingBr from "utils/getDayGreetingBr";

const Async = Load({
    loader: () =>
        import(
            "./CustomerAccessForm" /* webpackChunkName: "customer-access-form-lazy" */
        ),
});

export default function CustomerArea({ isOnline }) {
    const {
        loadingMainData,
        sColor,
        backColor,
        pColor,
        loginData,
        bizLinkName,
    } = useContext();
    const { isConnected, email, digitalMenuSkipLogin } = loginData;

    const [fullOpen, setFullOpen] = useState(false);
    const skipLogin = digitalMenuSkipLogin[bizLinkName];

    useEffect(() => {
        if (loadingMainData || skipLogin) return;
        if (!isConnected) setFullOpen(true);
    }, [loadingMainData, isConnected, skipLogin]);

    // const handleFullOpen = () => {
    //     setFullOpen(true);
    // };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const showConnectedBtns = () => (
        <section className="container-center my-3 ">
            <CustomerPanelBtn sColor={sColor} backColor={backColor} />
            <div className="ml-3">
                <ButtonFab
                    size="small"
                    title="sair"
                    fontSize={10}
                    position="relative"
                    onClick={() => {
                        showToast("Terminando acesso...", { dur: 15000 });
                        removeItems("global", ["digitalMenuLogin"]);
                        window.location.reload();
                    }}
                    backgroundColor="var(--expenseRed)"
                    variant="extended"
                />
            </div>
        </section>
    );

    const showMainArea = () => (
        <Fragment>
            <h1 className="font-weight-bold text-subtitle text-white text-center">
                Menu Digital
                <span
                    className="ml-3 text-em-1-0 d-inline-block text-pill"
                    style={{ backgroundColor: "var(--mainDark)" }}
                >
                    {isOnline ? "Online" : "Local"}
                </span>
            </h1>
            {isConnected ? (
                <div className="text-normal text-center">
                    <p className="text-normal position-relative">
                        Conectado por:
                        <span className="d-block font-weight-bold">
                            {email}
                        </span>
                    </p>
                    {showConnectedBtns()}
                </div>
            ) : (
                <p className="text-center text-shadow text-normal position-relative">
                    Olá, visitante!
                    <div className="my-3 container-center">
                        <ButtonFab
                            size="small"
                            title="Acessar conta cliente"
                            fontSize={10}
                            position="relative"
                            onClick={() => setFullOpen(true)}
                            backgroundColor={`var(--themeSDark--${pColor})`}
                            variant="extended"
                        />
                    </div>
                </p>
            )}
        </Fragment>
    );

    return (
        <Fragment>
            <section>
                <section className="text-normal text-white text-shadow customer-access-area">
                    {showMainArea()}
                    <style jsx>
                        {`
                            .customer-access-area {
                                background-color: var(--themePDark--${pColor});
                                border-radius: 20px;
                                padding: 10px;
                            }
                        `}
                    </style>
                </section>
            </section>
            {fullOpen && (
                <ModalFullContent
                    contentComp={<Async closeModal={handleFullClose} />}
                    fullOpen={fullOpen}
                    fullScreen={false}
                    setFullOpen={handleFullClose}
                    needCloseBtn={false}
                />
            )}
        </Fragment>
    );
}

/* ARCHIVES

{!isConnected && (
    <div className="mb-3 container-center">
        <ButtonFab
            size="medium"
            title="Quero!"
            position="relative"
            onClick={handleFullOpen}
            backgroundColor={`var(--themeSDark--${sColor})`}
            variant="extended"
        />
    </div>
)}

 */
