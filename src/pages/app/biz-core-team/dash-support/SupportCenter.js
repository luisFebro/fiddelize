import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { withRouter } from "react-router-dom";
import DashSectionTitle from "../fiddelize-cabin/DashSectionTitle";

const getTitle = () => (
    <span className="text-subtitle font-weight-bold">Suporte Fiddelize</span>
);

function SupportCenter({ history }) {
    const SectionTitle = getTitle();

    const goSupport = () => {
        history.push("/suporte");
    };

    const totalPendingSubjects = 5;

    return (
        <section className="text-normal text-purple">
            <DashSectionTitle title={SectionTitle} />
            <p className="text-center mt-5">
                Febro,{" "}
                <span className="text-subtitle text-pill">
                    {totalPendingSubjects}
                </span>{" "}
                assuntos pendentes
            </p>
            <div className="most-recent-chat container-center">
                <div className="panel shadow-babadoo">
                    <h2>&gt; Última mensagem:</h2>
                    <p className="font-italic">
                        &quot;Lorem ipsum dolor sit amet, consectetuer
                        adipiscing elit. Aenean commodo ligula eget dolor.
                        Aenean massa. Cum sociis natoque penatibus et magnis dis
                        parturient montes, nascetur ridiculus mus.&quot;
                    </p>
                    <h2>&gt; Assunto:</h2>
                    <p>Outros</p>
                    <h2>&gt; Cliente:</h2>
                    <p>Fernando Lima</p>
                    <h2>&gt; App:</h2>
                    <p>Cliente-admin</p>
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
