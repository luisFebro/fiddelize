import getFirstName from "utils/string/getFirstName";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showToast from "components/toasts";
import convertPhoneStrToInt from "utils/numbers/convertPhoneStrToInt";
import runLinkTagOnClick from "utils/tags/runLinkTagOnClick";
import getAPI, { decode } from "api";
import useData from "init";
import PtsRemovalPanelBtn from "./pts-removal-panel/PtsRemovalPanelBtn";

function PanelHiddenContent({ data = {} }) {
    const showRemovePointsBtn = () => (
        <PtsRemovalPanelBtn
            clientId={data.clientId}
            clientName={data.clientName}
            value={data.value}
        />
    );

    const { userId: staffId } = useData();

    const showTalkToClientBtn = () => {
        const handleWhatsappRedirect = () => {
            showToast("Um momento. Redirecionando...", { dur: 15000 });

            (async () => {
                const phone = await getAPI({
                    method: "post",
                    url: decode(),
                    body: {
                        code: data.clientPhone,
                        userId: staffId,
                    },
                });
                const convertedWhatsapp = convertPhoneStrToInt(phone);
                const cliFirstName = getFirstName(
                    data.clientName && data.clientName.cap()
                );
                const defaultWhatsappTxt = `Oi ${cliFirstName}! `;

                runLinkTagOnClick(
                    `https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${defaultWhatsappTxt}`
                );
            })();
        };

        return (
            <div className="mb-4 position-relative">
                <ButtonFab
                    title="Falar com cliente"
                    backgroundColor="var(--themeSDark--default)"
                    onClick={handleWhatsappRedirect}
                    iconFontAwesome={<FontAwesomeIcon icon="comment" />}
                    position="relative"
                    variant="extended"
                    size="small"
                />
            </div>
        );
    };

    return (
        <section className="position-relative text-normal enabledLink panel-hidden-content--root">
            <section className="my-4">
                <h2 className="mb-2 text-subtitle font-weight-bold text-white text-shadow text-center">
                    Mais Detalhes
                </h2>
            </section>
            {data.memberTask === "newClient" && (
                <p className="mb-4 main-font text-em-0-9 font-weight-bold text-shadow">
                    • Cadastrou com:
                    <span className="d-block main-font text-em-1-2 font-weight-bold">
                        {data.clientScore
                            ? `${data.clientScore} PTS.`
                            : "0 PTS."}
                    </span>
                </p>
            )}
            {data.taskDesc && (
                <p className="mb-4 main-font text-em-0-9 font-weight-bold text-shadow">
                    • Descrição:
                    <span className="d-block main-font text-em-1 font-weight-bold">
                        {data.taskDesc}
                    </span>
                </p>
            )}
            <p className="panel-hidden mb-4 main-font text-em-0-9 font-weight-bold text-shadow">
                • Última Avaliação:
                <span className="text-pill text-center review-desc d-block main-font text-em-1">
                    {data.clientLastReport
                        ? `"${data.clientLastReport}"`
                        : "Nenhuma"}
                </span>
                <span className="d-block text-center text-normal">
                    {data.clientLastXpScore
                        ? `Nota ${data.clientLastXpScore}`
                        : "Sem nota"}
                </span>
                <style jsx>
                    {`
                        .panel-hidden .review-desc {
                            padding: 5px 10px;
                        }
                    `}
                </style>
            </p>
            <p className="mb-4 main-font text-em-0-9 font-weight-bold text-shadow">
                • Pelo membro:
                <span className="d-inline-block main-font text-em-1">
                    {getFirstName(data.memberName && data.memberName.cap(), {
                        addSurname: true,
                    })}{" "}
                    <span className="text-em-0-9">({data.memberJob})</span>
                </span>
            </p>
            {showTalkToClientBtn()}
            {data.memberTask === "newPoints" && showRemovePointsBtn()}
        </section>
    );
}

export default PanelHiddenContent;

/* ARCHIVES
<TextField
    multiline
    rows={8}
    id="msgArea"
    name="message"
    InputProps={{
        style: styles.fieldFormValue,
    }}
    value={data.sentMsgDesc}
    variant="outlined"
    fullWidth
/>

<p className="animated flip slow delay-2s"> first flip that I was looking for with the style of  a n entire 360 with zooming.
<CreatedAtBr createdAt={createdAt} />
*/
