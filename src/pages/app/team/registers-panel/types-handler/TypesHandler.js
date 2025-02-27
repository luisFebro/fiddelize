import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import InstructionBtn from "components/buttons/InstructionBtn";
import QuickRegister from "./QuickRegister";
import CompleteRegister from "./CompleteRegister";

const getStyles = () => ({
    title: {
        background: "var(--themePLight)",
        padding: "5px 8px",
        borderRadius: "20px",
    },
    ctasArea: {
        margin: "130px 0 0",
    },
    titleIcon: {
        position: "absolute",
        left: "5px",
        top: "-15px",
        fontSize: "60px",
        filter: "drop-shadow(.5px .5px 1.5px black)",
        color: "white",
        zIndex: 10,
    },
    infoBtn: {
        top: 3,
        right: 20,
    },
});

export default function TypesHandler({ isNewMember = false }) {
    const [open, setOpen] = useState("quick"); // complete or quick
    const [formPayload, setFormPayload] = useState(null);

    const whichAudience = () => (isNewMember ? "membro" : "cliente");

    const styles = getStyles();

    const handleOpen = (nameComp) => {
        setOpen(nameComp);
    };

    const handleNewSendingEnv = (payload) => {
        // payload: { name, phone, email }
        setOpen("quick");
        setFormPayload(payload);
    };

    const handleTitle = () => {
        if (open === "complete") return "Cadastre agora";
        if (open === "quick") return "Envio de Convite";
    };
    const currTitle = handleTitle();
    const showTitle = () => {
        const thisIcon = open === "quick" ? "paper-plane" : "file-alt";

        const quickTxt = `Envie o convite com o link do seu app junto com o formulário de cadastro e deixe os ${whichAudience()}s se cadastrarem direto do conforto de seus dispositivos.`;
        const completeTxt = `É opcional, somente se ${
            isNewMember
                ? "já tiver os dados para cadastrar agora os membros da sua equipe."
                : "o cliente precisar que faça todo cadastro na hora para ele."
        } Após cadastro, envie para o ${whichAudience()} o link do app para acesso.`;
        const thisInfo = open === "quick" ? quickTxt : completeTxt;

        return (
            <section className="position-relative">
                {open && (
                    <FontAwesomeIcon
                        icon={thisIcon}
                        style={{
                            ...styles.titleIcon,
                            left: open === "complete" ? "10px" : "5px",
                            top: open === "complete" ? "-10px" : "-15px",
                        }}
                    />
                )}
                <h2
                    className="mx-4 text-shadow text-nowrap position-relative text-center text-white text-subtitle font-weight-bold"
                    style={styles.title}
                >
                    {currTitle}
                </h2>
                {open && (
                    <section
                        className="position-absolute"
                        style={styles.infoBtn}
                    >
                        <InstructionBtn
                            text={thisInfo}
                            mode="tooltip"
                            animated
                        />
                    </section>
                )}
            </section>
        );
    };

    const showSwitchBtnLeft = () => {
        const openThis = open === "quick" ? "complete" : "quick";
        const thisTitle = open === "quick" ? "⬅ Na hora" : "⬅️ Envio";

        return (
            open && (
                <section className="mt-5 ml-3 d-flex justify-content-start">
                    <ButtonFab
                        size="small"
                        title={thisTitle}
                        position="relative"
                        onClick={() => handleOpen(openThis)}
                        backgroundColor="var(--themeSDark--default)"
                        variant="extended"
                    />
                </section>
            )
        );
    };

    return (
        <section>
            {showTitle()}
            {showSwitchBtnLeft()}

            {open === "complete" && (
                <CompleteRegister
                    handleNewSendingEnv={handleNewSendingEnv}
                    isNewMember={isNewMember}
                />
            )}
            {open === "quick" && (
                <QuickRegister
                    formPayload={formPayload}
                    isNewMember={isNewMember}
                />
            )}
        </section>
    );
}

/* ARCHIVES
This will be replaced by:
Adicionar pontos para cliente?
SIM NÃO

this will be made when team session and staff system is being developed.
const showCTAs = () => (
    !open &&
     <Fragment>
         <div style={styles.ctasArea} className="d-flex justify-content-around">
             <ButtonFab
                 size="large"
                 title="SIM"
                 position="relative"
                 fontSizeTxt="25px"
                 onClick={() => handleOpen("quick")}
                 backgroundColor={"var(--themeSDark--default)"}
                 variant = 'extended'
                 width={160}
                 height={70}
             />
             <ButtonFab
                 size="large"
                 title="NÃO"
                 fontSizeTxt="25px"
                 position="relative"
                 onClick={() => handleOpen("complete")}
                 backgroundColor={"var(--themeSDark--default)"}
                 variant = 'extended'
                 width={160}
                 height={70}
             />
         </div>
     </Fragment>
);

 */
