import { Fragment, useState, useEffect } from "react";
import { useStoreDispatch } from "easy-peasy";
import { ShowPayWatermarks } from "../../comps/GlobalComps";
import useSendEmail from "../../../../../../hooks/email/useSendEmail";
import useData from "../../../../../../hooks/useData";
import "./_Pix.scss";
import QrCode from "../../../../../../components/QrCode";
import copyText from "../../../../../../utils/document/copyText";
import RadiusBtn from "../../../../../../components/buttons/RadiusBtn";
import { showSnackbar } from "../../../../../../redux/actions/snackbarActions";
import convertToReal from "../../../../../../utils/numbers/convertToReal";
import goFinishCheckout from "../../../helpers/pagseguro/goFinishCheckout";
import RedirectLink from "../../../../../../components/RedirectLink";
// import copyTextToClipboard from "../../../../../../utils/document/copyTextToClipboard";

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

    const dispatch = useStoreDispatch();

    useEffect(() => {
        if (alreadyPix) return;
        const runPix = async () => {
            const { data: responseData } = await goFinishCheckout({
                selectedMethod: "pix",
                modalData,
            }).catch((e) => {
                console.log(e);
                // setData((prev) => ({
                //     ...prev,
                //     loading: false,
                //     error: true,
                // }));
            });
            if (!responseData) return;

            setAlreadyPix(true);
            handleCancel(); // remove current orders
        };

        if (confirmedPix) {
            runPix();
        }
    }, [confirmedPix, alreadyPix, handleCancel, modalData]);

    const emailPayload = {
        payMethod: "pix",
        amount: modalData.itemAmount,
        cliName: modalData.userName,
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
        copyText(
            value,
            () =>
                showSnackbar(
                    dispatch,
                    successCopyTxt,
                    "success",
                    durationSuccessTxt
                ),
            { parentId }
        );
    };

    const pixKey = "24289c41-0b0d-485c-a3bf-ff00ca54b4b4";
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
                Chave:
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
        <section className="text-purple mx-3" style={{ marginTop: 80 }}>
            <h2 className="text-normal font-weight-bold">Notas Importantes:</h2>
            <p className="text-small">
                - O Pix deve ter <strong>o mesmo CPF do seu cadastro</strong>,
                pois o sistema da Fiddelize identifica sua conta através da
                parte do CPF visível do pix (6 dígitos) e o seu primeiro nome
                junto com a ID desta transição para atualizar seus novos
                serviços.
            </p>
            <p className="text-small">
                - Caso não seja possível atualizar os serviços e você já tenha
                transferido, o{" "}
                <strong>valor é reembolsado integralmente no mesmo dia</strong>{" "}
                e a transação é cancelada.
            </p>
            <p className="text-small">
                - O projeto da Fiddelize é ainda mantido como{" "}
                <strong>pessoa física</strong>, sem cadastro como pessoa
                jurídica. Você é um dos primeiros clientes investindo no nosso
                projeto, agradecemos seu apoio, {firstUserName}!
            </p>
            <p className="text-small">
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
