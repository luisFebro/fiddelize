import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import parse from "html-react-parser";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ButtonMulti, { faStyle } from "components/buttons/material-ui/ButtonMulti";

export default function ModalCenter({
    title = "teste",
    subtitle = "test subtitle",
    fullOpen,
    setFullOpen,
    contentComp,
    actionFunc,
    marginCTA,
    needIndex = true,
    needBackBtn = false,
    backColor,
}) {
    const [isYesBtnDisabled, setIsYesBtnDisabled] = useState(false);
    // LESSON: for critical data handling, the button should be permanent disabled

    const showTitle = () => (
        <DialogTitle id="form-dialog-title">
            <p
                className="m-0 text-subtitle text-white text-center font-weight-bold"
                style={{
                    lineHeight: "30px",
                }}
            >
                {title && parse(title)}
            </p>
        </DialogTitle>
    );

    const showSubTitle = () => (
        <DialogContentText>
            <div
                className="m-0 mx-3 text-pill text-white text-normal text-center"
                style={{
                    backgroundColor: `var(--themeP--${backColor})`,
                }}
            >
                {subtitle && parse(subtitle)}
            </div>
        </DialogContentText>
    );

    return (
        <Dialog
            PaperProps={{
                style: {
                    background:
                        "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                },
            }}
            style={{ zIndex: needIndex ? 3000 : 15 }}
            open={fullOpen}
            maxWidth="md"
            aria-labelledby="form-dialog-title"
            className="animated fadeIn faster"
        >
            {showTitle()}
            {showSubTitle()}
            {contentComp}
            <div
                style={{ color: "#b4aeae" }}
                className="my-3 font-site text-em-0-9 text-center"
            >
                Parabéns!
                <br />E já pode resgatar agora
            </div>
            <div
                className="position-absolute text-white"
                style={{
                    bottom: 10,
                    right: 10,
                    overflow: "none",
                }}
            >
                <img
                    width={100}
                    src="/img/icons/game/confetti.svg"
                    alt="confete"
                />
            </div>
        </Dialog>
    );
}

/*

const showActionBtns = () => (
    <Fragment>
        {needBackBtn ? (
            <ButtonMulti
                title="Voltar"
                onClick={() => setFullOpen(false)}
                variant="link"
            />
        ) : (
            <section>
                <div
                    className={`${
                        marginCTA || "mt-5"
                    } d-flex justify-content-center`}
                >
                    <ButtonMulti
                        title="NÃO"
                        onClick={() => setFullOpen(false)}
                        variant="link"
                    />
                    <ButtonMulti
                        title="SIM"
                        disabled={!!isYesBtnDisabled}
                        onClick={() => {
                            actionFunc();
                            setIsYesBtnDisabled(true);
                            setFullOpen(false);
                        }}
                        iconFontAwesome={
                            <FontAwesomeIcon icon="times" style={faStyle} />
                        }
                        backgroundColor="var(--mainRed)"
                    />
                </div>
            </section>
        )}
    </Fragment>
);

 */
