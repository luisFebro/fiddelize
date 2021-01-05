import React, { Fragment } from "react";
import getFirstName from "../../../../../../utils/string/getFirstName";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
// import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";

// const isSmall = window.Helper.isSmallScreen();

export default function AsyncPix({ modalData }) {
    // const [copy, setCopy] = useState(false);

    const {
        responseData,
        processing,
        handleDataMethod,
        itemDescription,
        itemAmount,
        adminName,
        PagSeguro,
    } = modalData;

    // useEffect(() => {
    //     handleDataMethod({
    //      paymentMethod: "No Débito",
    //      senderHash: ffds,
    //     });
    // }, [])

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
        </div>
    );

    const showMaintenanceMsg = () => (
        <section className="container-center-col mx-3 my-5 text-subtitle font-weight-bold text-purple text-left">
            <span className="text-em-1-5">Pix</span>
            <br />
            {getFirstName(adminName)}, ainda estamos trabalhando nesta opção de
            pagamento. Logo ficará disponível!
        </section>
    );

    return (
        <Fragment>
            {showTitle()}
            {showMaintenanceMsg()}
            <ShowPayWatermarks needAnima={false} isPix={true} />
        </Fragment>
    );
}
