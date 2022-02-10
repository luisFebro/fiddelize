import { Fragment, useState, useEffect } from "react";
import useSendEmail from "hooks/email/useSendEmail";
import useData from "init";
import QrCode from "components/QrCode";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import convertToReal from "utils/numbers/convertToReal";
import RedirectLink from "components/RedirectLink";
import goFinishCheckout from "../../../helpers/pagseguro/goFinishCheckout";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import "./_Pix.scss";

// const isSmall = window.Helper.isSmallScreen();

export default function AsyncPix({ modalData }) {
    const [confirmedPix, setConfirmedPix] = useState(false);
    const [alreadyPix, setAlreadyPix] = useState(false);
    const [firstUserName] = useData(["firstName"]);

    const {
        // processing,
        itemDescription,
        itemAmount,
        handleCancel,
    } = modalData;

    useEffect(() => {
        if (alreadyPix) return;
        const runPix = async () => {
            const responseData = await goFinishCheckout({
                selectedMethod: "pix",
                modalData,
            });
            if (!responseData) return;

            handleCancel(); // remove current orders
            await setAlreadyPix(true);
        };

        if (confirmedPix) runPix();
    }, [confirmedPix, alreadyPix, handleCancel, modalData]);

    const emailPayload = {
        payMethod: "pix",
        amount: modalData.itemAmount,
        cliName: modalData.name,
        servDesc: modalData.itemDescription,
        reference: modalData.reference,
        bizName: modalData.bizName,
    };

    useSendEmail({
        type: "payAlert",
        payload: emailPayload,
        trigger: !alreadyPix,
    });

    const investAmount = convertToReal(itemAmount, {
        moneySign: true,
        needFraction: true,
    });

    const showTitle = () => (
        <div className="mt-2">
            <p className="text-em-1-9 main-font text-white text-center font-weight-bold">
                Fiddelize Invista
            </p>
            <section className="mt-3 mb-4 container-center">
                <img
                    width={180}
                    height="auto"
                    src="/img/icons/pay/pix-name.png"
                    alt="pix logo"
                />
            </section>
        </div>
    );

    const showPixData = () => (
        <section>
            <p className="text-small mx-3">
                Dados do Portador Pix:
                <br />
                <strong>Luis Felipe Bruno Feitoza.</strong>
                <br />
                CPF: <strong>***.248.892-**</strong>
            </p>
        </section>
    );

    const handleCopy = ({
        value,
        successCopyTxt,
        parentId,
        durationSuccessTxt = 2000,
    }) => {
        copyText(value, {
            msg: successCopyTxt,
            msgDur: durationSuccessTxt,
            parentId,
        });
    };

    // nubank
    const pixKey = "c247d064-9f0f-4e92-95b6-0a3ab04c83fa";
    const queryDesc = itemDescription ? `&d=${itemDescription}` : "";
    const showMainData = () => (
        <section className="animated fadeInUp delay-1s text-center">
            <section
                className="text-normal mx-3 py-4"
                style={{
                    backgroundColor: "var(--themePDark)",
                    borderRadius: "30px",
                }}
            >
                Chave Pix:
                <br />
                <span className="text-subtitle font-weight-bold">{pixKey}</span>
                <div className="container-center" id="parentPixKey">
                    <RadiusBtn
                        title="copiar chave"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: pixKey,
                                successCopyTxt:
                                    "Chave pix copiada! Use para transferir o valor no seu app financeiro favorito",
                                parentId: "parentPixKey",
                                durationSuccessTxt: 5000,
                            })
                        }
                    />
                </div>
                <br />
                <span className="text-normal">Valor a transferir:</span>
                <br />
                <span className="text-subtitle font-weight-bold">
                    {investAmount}
                </span>
                <div className="container-center" id="parentPixValue">
                    <RadiusBtn
                        title="copiar valor"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: itemAmount,
                                successCopyTxt: "Valor copiado!",
                                parentId: "parentPixValue",
                                durationSuccessTxt: 5000,
                            })
                        }
                    />
                </div>
            </section>
            <section className="container-center my-5">
                <p className="text-normal text-center">Ou escaneiar chave:</p>
                <div className="qr-container">
                    <QrCode value={pixKey} fgColor="var(--themeP)" />
                </div>
                <p className="mt-3 text-normal text-center">
                    Prefere escaneiar de outro dispositivo?
                </p>
                <div className="container-center" id="parentLinkSitePix">
                    <RadiusBtn
                        title="copiar link página pix"
                        backgroundColor="var(--themeSDark)"
                        size="small"
                        onClick={() =>
                            handleCopy({
                                value: `https://fiddelize.com.br/pix?v=${itemAmount}${queryDesc}`,
                                successCopyTxt:
                                    "Link da página copiado! Abra o link da página pix copiado em outro dispositivo",
                                parentId: "parentLinkSitePix",
                                durationSuccessTxt: 8000,
                            })
                        }
                    />
                </div>
            </section>
        </section>
    );

    const showImportantNotes = () => (
        <section
            className="font-site text-em-1 text-purple mx-3"
            style={{ marginTop: 80 }}
        >
            <h2 className="text-normal font-weight-bold">Notas Importantes:</h2>
            <p>
                - O Pix deve ter <strong>o mesmo CPF do seu cadastro</strong>,
                pois o sistema da Fiddelize identifica sua conta através da
                parte do CPF visível do pix (6 dígitos) e o seu primeiro nome
                junto com a ID desta transição para atualizar seus novos
                serviços.
            </p>
            <p>
                - Caso não seja possível atualizar os serviços e você já tenha
                transferido, o{" "}
                <strong>valor é reembolsado integralmente até 24 horas</strong>{" "}
                e a transação é cancelada.
            </p>
            <p>
                - A Fiddelize está trabalhando para integrar o sistema de
                pagamento com <strong>emissão de nota fiscal</strong>. Também
                estamos no processo de transição de pessoa física para{" "}
                <strong>pessoa jurídica</strong> para atender todas exigências
                do mercado. {firstUserName}, agradecemos seu apoio na jornada em
                ajudar pessoas como você a conquistar mais clientes!
            </p>
            <p>
                - Apesar da natureza do pagamento ser instantâneo, os serviços
                contratados são ativados no período entre{" "}
                <strong>5 minutos até 12 horas</strong> - todos os dias.
            </p>
        </section>
    );

    const showShape = () => (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                transform: "translateY(85%)",
            }}
        >
            <img
                src="/img/illustrations/home/shapes/landing-1-shape.svg"
                alt="shape 1"
            />
        </div>
    );

    const showPixConfirmationBtn = () => (
        <div className="my-5 container-center">
            <h2 className="mb-4 text-normal font-weight-bold text-center mx-3">
                Confirmar investimento com Pix?
            </h2>
            <RadiusBtn
                title="sim, continuar"
                backgroundColor="var(--themeSDark)"
                size="small"
                onClick={() => setConfirmedPix(true)}
            />
        </div>
    );

    const showHistoryInvestBtn = () => (
        <div className="container-center mt-5" style={{ marginBottom: 150 }}>
            <p className="text-normal text-purple mx-3 font-weight-bold">
                Os dados do pix acima já estão registrados no seu histórico de
                investimentos.
            </p>
            <RedirectLink toDashTab="Pro">
                <RadiusBtn
                    size="small"
                    title="Ir para Histórico"
                    onClick={null}
                    backgroundColor="var(--themeSDark)"
                />
            </RedirectLink>
        </div>
    );

    return (
        <Fragment>
            <section className="theme-p text-white position-relative">
                {showTitle()}
                {confirmedPix ? (
                    <Fragment>
                        {showMainData()}
                        {showPixData()}
                    </Fragment>
                ) : (
                    showPixConfirmationBtn()
                )}
                {showShape()}
            </section>
            {confirmedPix && showImportantNotes()}
            {confirmedPix && showHistoryInvestBtn()}
            <ShowPayWatermarks needAnima={false} isPix />
        </Fragment>
    );
}
