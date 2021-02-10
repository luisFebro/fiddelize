import React, { Fragment } from "react";
import getFirstName from "../../../../../../utils/string/getFirstName";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import useSendEmail from "../../../../../../hooks/email/useSendEmail";

// import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";

// const isSmall = window.Helper.isSmallScreen();

export default function AsyncPix({ modalData }) {
    // const [copy, setCopy] = useState(false);
    const emailPayload = {
        payMethod: "pix",
        amount: modalData.itemAmount,
        cliName: modalData.userName,
        servDesc: modalData.itemDescription,
        reference: modalData.reference,
        bizName: modalData.bizName,
    };
    useSendEmail({ type: "payAlert", payload: emailPayload });

    const {
        // responseData,
        // processing,
        // handleDataMethod,
        // itemDescription,
        // itemAmount,
        // PagSeguro,
        adminName,
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
