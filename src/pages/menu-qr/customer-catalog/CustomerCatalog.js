import QrCode from "components/QrCode";

export default function CustomerCatalog({ match }) {
    const tableId = match && match.params && match.params.tableId;
    const bizLinkId = match && match.params && match.params.bizLinkId;
    const bizLogo = "/img/test/restaurant.jpg";
    const width = 110;
    const height = 110;
    const url = match && match.url;
    // show either qr code to be scanned or the product catalog
    // const isQrDisplay = tableId === "qr";

    const showLogo = () => (
        <div className="my-5 container-center">
            <img
                src={bizLogo}
                width={width}
                height={height}
                title={`logo da ${bizLinkId}`}
                alt={`logo empresa ${bizLinkId}`}
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
        <section>
            <h1 className="font-weight-bold mt-5 text-subtitle text-white text-center">
                {showLogo()}
                Peça seu pedido:
            </h1>
            {showQrCode()}
        </section>
    );
}
