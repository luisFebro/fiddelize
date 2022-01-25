import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import SelectField from "components/fields/SelectField";
import QrCode from "components/QrCode";
import { useBizData } from "init";

export default function Advertise() {
    const [data, setData] = useState({
        markOpt: null,
        markOptPlaceId: null,
        comp: "main",
    });
    const { comp, markOpt, markOptPlaceId } = data;

    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;

    useEffect(() => {
        const thisData = markOpt || markOptPlaceId;
        if (thisData && thisData.includes("Selecione")) return;
        if (markOpt === "online" || markOptPlaceId)
            setData((prev) => ({ ...prev, comp: "adPanel" }));
    }, [markOpt, markOptPlaceId]);

    return (
        <section className="mx-3 text-normal text-white">
            {comp === "main" && (
                <Main
                    setData={setData}
                    markOpt={markOpt}
                    markOptPlaceId={markOptPlaceId}
                />
            )}
            {comp === "adPanel" && (
                <AdPanel
                    setData={setData}
                    markOptPlaceId={markOptPlaceId}
                    bizLogo={bizLogo}
                    width={width}
                    height={height}
                />
            )}
        </section>
    );
}

// COMPS
function Main({ setData, markOpt, markOptPlaceId }) {
    const showTitle = () => (
        <div className="my-3">
            <p className="text-subtitle text-white text-center font-weight-bold">
                Divulgação Menu
            </p>
        </div>
    );

    const showSelect = () => {
        const valuesArray = [
            { val: "local", showVal: "Local" },
            { val: "online", showVal: "Online" },
        ];

        const handleSelected = (select) => {
            if (!select) return;

            setData((prev) => ({
                ...prev,
                markOpt: select,
            }));
        };

        return (
            <div className="mt-3">
                <SelectField
                    title="Selecione forma divulgação:"
                    valuesArray={valuesArray}
                    handleValue={handleSelected}
                    needSetTitle={false}
                    defaultValue={markOpt}
                />
            </div>
        );
    };

    const showSelectPlaceId = () => {
        const valuesArray = [
            { val: "01", showVal: "01" },
            { val: "02", showVal: "02" },
            { val: "03", showVal: "03" },
            { val: "04", showVal: "04" },
            { val: "05", showVal: "05" },
            { val: "06", showVal: "06" },
            { val: "07", showVal: "07" },
            { val: "08", showVal: "08" },
            { val: "09", showVal: "09" },
            { val: "10", showVal: "10" },
            { val: "11", showVal: "11" },
            { val: "12", showVal: "12" },
            { val: "13", showVal: "13" },
            { val: "14", showVal: "14" },
            { val: "15", showVal: "15" },
        ];

        const handleSelected = (select) => {
            if (!select) return;

            setData((prev) => ({
                ...prev,
                markOptPlaceId: select,
            }));
        };

        return (
            <div className="mt-3 animated fadeInUp">
                <SelectField
                    title="Selecione ID Lugar:"
                    valuesArray={valuesArray}
                    handleValue={handleSelected}
                    needSetTitle={false}
                    defaultValue={markOptPlaceId}
                />
            </div>
        );
    };

    const showPrintServiceBtn = () => (
        <section>
            <p className="animated fadeInUp m-0 text-shadow">
                Quer ter menu impresso personalizado com seu código QR?
            </p>
            <div className="container-center mt-3 mb-5">
                <Link className="no-text-decoration" to="/suporte">
                    <ButtonFab
                        title="Fale Conosco"
                        backgroundColor="var(--themeSDark)"
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="large"
                    />
                </Link>
            </div>
        </section>
    );

    return (
        <Fragment>
            {showTitle()}
            <div className="mb-5" style={{ marginTop: 100 }}>
                {showSelect()}
                {markOpt === "local" && (
                    <Fragment>
                        <h2 className="mt-5 main-font text-em-0-9">
                            O ID do lugar é a identificação de onde o cliente
                            faz o{" "}
                            <span className="font-weight-bold">
                                pedido presencialmente
                            </span>
                            . Pode ser uma mesa, assento, etc.
                        </h2>
                        {showSelectPlaceId()}
                    </Fragment>
                )}
            </div>
            <div style={{ marginTop: 100 }} />
            {markOpt === "local" && showPrintServiceBtn()}
        </Fragment>
    );
}

function AdPanel({ markOptPlaceId, bizLogo, width, height, setData }) {
    const { bizLinkName } = useBizData();

    const getUrl = () => `${bizLinkName}/menu/c/${markOptPlaceId || "online"}`;

    const url = getUrl();
    console.log("url", url);

    const showLogo = () => (
        <div className="mt-2 mb-3 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title="logo"
                alt="logo"
            />
        </div>
    );

    const showQrCode = () => {
        const imageSettings = {
            src: bizLogo,
        };

        const imageSquare = true; // bizLogo && bizLogo.includes("h_100,w_100");

        return (
            <section className="mb-5 container-center">
                <div className="qr-container">
                    <QrCode
                        value={`https:/fiddelize.com.br/${url}`}
                        fgColor="var(--themeP--purple)"
                        imageSettings={imageSettings}
                        imageSquare={imageSquare}
                    />
                </div>
            </section>
        );
    };

    return (
        <Fragment>
            {showLogo()}
            <h1 className="font-weight-bold mt-5 text-subtitle text-white text-center">
                Peça seu pedido:
            </h1>
            {showQrCode()}
            <div className="container-center my-5">
                <ButtonFab
                    title="Gerar novo"
                    backgroundColor="var(--themeSDark)"
                    onClick={() =>
                        setData((prev) => ({
                            ...prev,
                            markOpt: null,
                            markOptPlaceId: null,
                            comp: "main",
                        }))
                    }
                    position="relative"
                    variant="extended"
                    size="large"
                />
            </div>
        </Fragment>
    );
}
// END COMPS
