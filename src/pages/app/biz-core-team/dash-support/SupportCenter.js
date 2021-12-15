import { useState, Fragment } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { withRouter } from "react-router-dom";
import useAPI, { readSupportRecentData } from "api/useAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useData from "init";
import Img from "components/Img";
import getId from "utils/getId";
import getSubjectBr from "components/chat/helpers";
import DashSectionTitle from "../fiddelize-cabin/DashSectionTitle";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">Suporte Fiddelize</span>
);

function SupportCenter({ history }) {
    const SectionTitle = getTitle();

    // this gonna be a random id to update the state
    const [trigger, setTrigger] = useState(true);

    const { userId } = useData();

    const goSupport = () => {
        history.push("/suporte");
    };

    const { data: dataRecentSupport, loading } = useAPI({
        url: readSupportRecentData(),
        params: { userId }, // for auth only
        needAuth: true,
        trigger,
    });

    const pendingSubjectCount =
        dataRecentSupport && dataRecentSupport.pendingSubjectCount;
    const lastPendingSubject =
        dataRecentSupport && dataRecentSupport.lastPendingSubject;

    const appRole = lastPendingSubject && lastPendingSubject.appRole;
    const msg = lastPendingSubject && lastPendingSubject.msg;
    const subjectCategory =
        lastPendingSubject && lastPendingSubject.subjectCategory;
    const userName = lastPendingSubject && lastPendingSubject.userName;

    const msgContent = msg && msg.content;
    const msgType = msg && msg.type; // if msgType equals img, then handle the content as the url in a img element

    const plural = pendingSubjectCount > 1 ? "s" : "";

    const showReloadBtn = () => (
        <div
            className="position-absolute"
            style={{
                bottom: -10,
                right: -10,
            }}
        >
            <ButtonFab
                position="relative"
                backgroundColor="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon
                        icon="sync-alt"
                        className="d-flex align-items-center"
                        style={{ fontSize: 35 }}
                        needIconShadow={false}
                        onClick={() => {
                            setTrigger(getId());
                        }}
                    />
                }
                size="large"
            />
        </div>
    );

    const mainContent = (
        <Fragment>
            <div className="position-relative panel shadow-babadoo">
                {pendingSubjectCount === 0 ? (
                    <p className="text-normal font-weight-bold text-center my-5">
                        Sem assuntos de cliente no momento.
                    </p>
                ) : (
                    <Fragment>
                        <h2>&gt; Última mensagem:</h2>
                        <section className="my-3">
                            {msgType === "text" ? (
                                <p className="font-italic">
                                    &quot;{msgContent}&quot;
                                </p>
                            ) : (
                                <Img
                                    dataSrc={msgContent}
                                    timeout={2000}
                                    width="auto"
                                    src={msgContent}
                                    className="img-center shadow-babadoo"
                                    mode="skeleton"
                                    imgContainerClass=""
                                    alt="imagem tirado do suporte"
                                />
                            )}
                        </section>
                        <h2>&gt; Assunto:</h2>
                        <p>{getSubjectBr(subjectCategory)}</p>
                        <h2>&gt; Cliente:</h2>
                        <p>{userName}</p>
                        <h2>&gt; App:</h2>
                        <p>{appRole}</p>
                    </Fragment>
                )}
                {showReloadBtn()}
            </div>
            <style jsx>
                {`
                    .most-recent-chat .panel {
                        background: var(--mainWhite);
                        border-radius: 20px;
                        padding: 25px;
                        max-width: 500px;
                    }

                    .most-recent-chat .panel p {
                        color: grey;
                    }
                `}
            </style>
        </Fragment>
    );

    return (
        <section className="text-normal text-purple">
            <DashSectionTitle title={SectionTitle} />
            <p className="text-center mt-5">
                Febro,{" "}
                <span className="text-subtitle text-pill">
                    {loading ? "..." : pendingSubjectCount}
                </span>{" "}
                assunto{plural} pendente{plural}
            </p>
            <div
                className="most-recent-chat container-center"
                style={{
                    minHeight: loading ? 200 : undefined,
                }}
            >
                {loading ? (
                    <p className="text-subtitle text-grey text-center my-5">
                        Carregando...
                    </p>
                ) : (
                    mainContent
                )}
            </div>
            <div className="container-center mt-5">
                <ButtonFab
                    title="Acessar Painel Suporte"
                    position="relative"
                    variant="extended"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    onClick={goSupport}
                    size="large"
                />
            </div>
            <div
                style={{
                    marginBottom: "150px",
                }}
            />
        </section>
    );
}

export default withRouter(SupportCenter);
