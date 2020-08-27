import React, { useState, Fragment } from 'react';
import QuickRegister from './QuickRegister';
import CompleteRegister from './CompleteRegister';
import ButtonFab from '../../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InstructionBtn from '../../../../components/buttons/InstructionBtn';

const getStyles = () => ({
    title: {
        background: "var(--themePLight)",
        padding: '5px 8px',
        borderRadius: '20px',
    },
    ctasArea: {
        margin: '130px 0 0',
    },
    titleIcon: {
        position: 'absolute',
        left: '10px',
        fontSize: '60px',
        filter:  'drop-shadow(.5px .5px 1.5px black)',
        color: 'white',
        zIndex: 10,
    },
    infoBtn: {
        top: 0,
        right: 0,
    }
});

export default function TypesHandler() {
    const [open, setOpen] = useState(""); // complete or quick

    const styles = getStyles();

    const handleOpen = (nameComp) => {
        setOpen(nameComp);
    }

    const handleTitle = () => {
        if(!open) return "Qual tipo de cadastro?";
        if(open === "complete") return "Cadastro Completo";
        if(open === "quick") return "Cadastro Rápido";
    }
    const currTitle = handleTitle();
    const showTitle = () => {
        const thisIcon = open === "quick" ? "bolt" : "file-alt"

        const quickTxt = "Envie o link do seu app com o formulário e deixe seu cliente fazer o cadastro direto por lá.";
        const completeTxt = "Faça todo o cadastro e envio o link para o cliente acessar o app direto com CPF."
        const thisInfo = open === "quick" ? quickTxt : completeTxt;

        return(
            <section className="position-relative">
                {open && (
                    <FontAwesomeIcon icon={thisIcon} style={{...styles.titleIcon, fontSize: open === "complete" ? "40px" : "60px" }} />
                )}
                <h2
                    className="mx-4 text-nowrap position-relative text-center text-white text-subtitle font-weight-bold"
                    style={styles.title}
                >
                    {currTitle}
                </h2>
                {open && (
                    <section className="position-absolute" style={styles.infoBtn}>
                        <InstructionBtn
                            text={thisInfo}
                            mode="tooltip"
                        />
                    </section>
                )}
            </section>
        );
    }


    const showSwitchBtnLeft = () => {
        const openThis = open === "quick" ? "complete" : "quick";
        const thisTitle = open === "quick" ? "⬅️ Completo" : "⬅️ Rápido"

        return(
            open &&
            <section className="mt-5 ml-3 d-flex justify-content-start">
                <ButtonFab
                   size="small"
                   title={thisTitle}
                   position="relative"
                   onClick={() => handleOpen(openThis)}
                   backgroundColor={"var(--themeSDark--default)"}
                   variant = 'extended'
                />
            </section>
        );
    }

    const showCTAs = () => (
        !open &&
         <Fragment>
             <div style={styles.ctasArea} className="d-flex justify-content-around">
                 <ButtonFab
                     size="large"
                     title="CADASTRO RÁPIDO"
                     position="relative"
                     onClick={() => handleOpen("quick")}
                     backgroundColor={"var(--themeSDark--default)"}
                     variant = 'extended'
                     width={160}
                     padding="40px 16px"
                 />
                 <ButtonFab
                     size="large"
                     title="CADASTRO COMPLETO"
                     position="relative"
                     onClick={() => handleOpen("complete")}
                     backgroundColor={"var(--themeSDark--default)"}
                     variant = 'extended'
                     width={160}
                     padding="40px 16px"
                 />
             </div>
         </Fragment>
    );

    return (
        <section>
            {showTitle()}
            {showSwitchBtnLeft()}
            {showCTAs()}

            {open === "complete" && (
                <CompleteRegister />
            )}
            {open === "quick" && (
                <QuickRegister />
            )}
        </section>
    );
}