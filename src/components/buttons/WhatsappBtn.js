import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBizData } from "init";
import convertPhoneStrToInt from "utils/numbers/convertPhoneStrToInt";
import ButtonMulti, { faStyle } from "./material-ui/ButtonMulti";
import showToast from "../toasts";

export default function WhatsappBtn({
    title = "Iniciar chat",
    elsePhone,
    backgroundColor,
    isDisabled,
    icon = "comment",
}) {
    const { bizWhatsapp, bizName, themeSColor } = useBizData();

    const targetedNumber = elsePhone || bizWhatsapp;
    const convertedWhatsapp = convertPhoneStrToInt(targetedNumber);
    const greetingTxt = elsePhone
        ? `Oi, vim pelo app da ${bizName} para suporte e preciso `
        : `Oi, vim pelo app da ${bizName} e preciso `;

    return (
        <a
            target="_blank"
            className="no-text-decoration"
            title="Clique aqui para enviar uma mensagem em nosso WhatsApp"
            rel="noopener noreferrer"
            href={`https://api.whatsapp.com/send?phone=55${convertedWhatsapp}&text=${greetingTxt}`}
            onClick={() =>
                showToast("Um momento. Redirecionando...", { dur: 10000 })
            }
        >
            <ButtonMulti
                title={title}
                onClick={null}
                disabled={isDisabled}
                color="var(--mainWhite)"
                backgroundColor={
                    backgroundColor || `var(--themeSDark--${themeSColor})`
                }
                backColorOnHover={
                    backgroundColor || `var(--themeSDark--${themeSColor})`
                }
                iconFontAwesome={
                    <FontAwesomeIcon icon={icon} style={faStyle} />
                }
            />
        </a>
    );
}
