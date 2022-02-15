import { Fragment, useState } from "react";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import getDayGreetingBr from "utils/getDayGreetingBr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getItems from "init/lStorage";
import useContext from "context";

const Async = Load({
    loader: () =>
        import(
            "./CustomerAccessForm" /* webpackChunkName: "customer-access-form-lazy" */
        ),
});

const [digitalMenuLogin] = getItems("global", ["digitalMenuLogin"]);

export default function CustomerAccess() {
    const { sColor, pColor, bizLogo, bizLinkName } = useContext();
    const [fullOpen, setFullOpen] = useState(false);
    let [data, setData] = useState({
        email:
            digitalMenuLogin && digitalMenuLogin[bizLinkName]
                ? digitalMenuLogin[bizLinkName]
                : null,
        errorEmail: false,
    });
    const { email } = data;
    const isConnected = Boolean(email);

    data = {
        ...data,
        bizLogo,
        sColor,
        pColor,
        bizLinkName,
    };

    const handleFullOpen = () => {
        setFullOpen(true);
    };

    const handleFullClose = () => {
        setFullOpen(false);
    };

    const showMainMsg = () => (
        <Fragment>
            {isConnected ? (
                <div className="text-normal text-center">
                    <p className="text-normal">
                        Conectado por:
                        <span className="d-block font-weight-bold">
                            {email}
                        </span>
                    </p>
                </div>
            ) : (
                <p className="text-left">
                    <FontAwesomeIcon icon="bell" /> Seja notificado sobre seu
                    pedido!
                </p>
            )}
        </Fragment>
    );

    return (
        <Fragment>
            <section>
                <section className="text-normal text-white text-shadow customer-access-area">
                    <p className="text-center">{getDayGreetingBr()}!</p>
                    {showMainMsg()}
                    {!isConnected && (
                        <div className="my-3 container-center">
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
                    contentComp={
                        <Async
                            closeModal={handleFullClose}
                            data={data}
                            setData={setData}
                        />
                    }
                    fullOpen={fullOpen}
                    fullScreen={false}
                    setFullOpen={handleFullClose}
                />
            )}
        </Fragment>
    );
}
