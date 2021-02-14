import { useState } from "react";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
// comps
import BankList from "./bank-list/BankList"; // const isSmall = window.Helper.isSmallScreen();
import LinkBankDebit from "./LinkBankDebit";
import useSendEmail from "../../../../../../hooks/email/useSendEmail";

/* IMPORTANT NOTES
only works in the production mode. sandbox gives error.
currently, there is 4 banks available.
example of encripted link sent by pagseguro: https://pagseguro.uol.com.br/checkout/payment/eft/print.jhtml?c=be4c1c7dad60ab66d22180a3c9f0bb8d9246df62d15bfc4013f57c2f24d065fe6fcfefd5fd885a60
ITAU - https://shopline.itau.com.br/shopline/shopline.aspx
mobile friendly - no

BANRISUL - https://ww7.banrisul.com.br/brb/link/brbwe4hw.aspx?Largura=800&Sistema=BANRICOMPRAS&Servico=brbw69hw_Banricompras.aspx&Dados=COD_REDE:410138000|COD_ESTAB:148|DT_MOVIMENTO:2020%2D12%2D31|NSU_ORIGEM:43971|URL_NOK:https%3A%2F%2Fnotifica2%2Euol%2Ecom%2Ebr%2Fbpag2%2Fservlet%2FBjBanrisulControl%3Ffinaliza%3D0%26%2526VlrTotal%253D338%26idpedido%3D444836390%26identpedido%3D444836390|FORMA_PGTO:PGTA|STATUS:0|MSG_ERRO_CLIENTE:%20|MSG_ERRO_TECNICO:%20
mobile friendly - yes

BANCO_BRASIL - https://mpag.bb.com.br/site/mpag/
mobile friendly - no

BRADESCO - no working internal server error
 */

export default function AsyncDebit({ modalData }) {
    const [data, setData] = useState({
        currComp: "bankList",
        selectedBank: null,
    });
    const { selectedBank, currComp } = data;

    const emailPayload = {
        payMethod: "débito bancário",
        amount: modalData.itemAmount,
        cliName: modalData.userName,
        servDesc: modalData.itemDescription,
        reference: modalData.reference,
        bizName: modalData.bizName,
    };
    useSendEmail({ type: "payAlert", payload: emailPayload });

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-purple text-center font-weight-bold">
                Fiddelize Invista
            </p>
            <p className="main-font my-3 text-center text-em-1-5 font-weight-bold">
                Débito Bancário
            </p>
        </div>
    );

    return (
        <section className="mx-3 text-purple text-left">
            {showTitle()}
            {currComp === "bankList" && (
                <BankList modalData={modalData} setMainData={setData} />
            )}
            {currComp === "linkBankDebit" && (
                <LinkBankDebit
                    selectedBank={selectedBank}
                    modalData={modalData}
                />
            )}
            <ShowPayWatermarks needAnima={false} />
        </section>
    );
}
