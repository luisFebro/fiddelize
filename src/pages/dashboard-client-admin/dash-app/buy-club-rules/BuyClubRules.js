import { Fragment, useState } from "react";
import { useBizData } from "init";
import copyText from "utils/document/copyText";
import RadiusBtn from "components/buttons/RadiusBtn";
import { withRouter } from "react-router-dom";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncFiddelizeContact = Load({
    loader: () =>
        import(
            "pages/dashboard-client-admin/comps/FiddelizeContact" /* webpackChunkName: "fiddelize-contact-modal-lazy" */
        ),
});

function BuyClubRules({ history }) {
    const [fullOpen, setFullOpen] = useState(false);
    const { bizLinkName } = useBizData();

    const coreLink = `/${bizLinkName}/regras`;
    const clubRulesLink = `https://fiddelize.com${coreLink}`;

    const handleCopy = () => {
        copyText(clubRulesLink, {
            msg: "Link das regras do clube de compra copiado!",
        });
    };

    const showLinkAndCTAs = () => (
        <Fragment>
            <div className="text-purple font-site text-em-0-9 font-weight-bold text-break">
                {clubRulesLink}
            </div>
            <section
                className="container-center"
                style={{ padding: "10px 0 30px" }}
            >
                <div>
                    <RadiusBtn
                        size="small"
                        title="copiar"
                        onClick={handleCopy}
                    />
                </div>
                <div className="pl-5">
                    <RadiusBtn
                        size="small"
                        title="acessar"
                        onClick={() => history.push(coreLink)}
                    />
                </div>
            </section>
        </Fragment>
    );

    const handleFullClose = () => {
        setFullOpen(false);
    };

    return (
        <section className="text-normal text-grey hidden-content--root">
            <h2 className="text-normal font-weight-bold text-center text-purple">
                Regras do clube de compra
            </h2>
            <p>
                As regras do seu clube de compra se{" "}
                <strong>definem e adaptam automaticamente</strong> de acordo com
                suas preferências e parâmetros definidos por você como os dados
                dos jogos, moedas, prazos, etc.
            </p>
            <p>
                Assim como mostra - de forma simples e breve - o{" "}
                <strong>comportamento dos algorítmos</strong> da Fiddelize em
                funcionalidades principais.
            </p>
            <p>
                Se tiver alguma sugestão,{" "}
                <span onClick={() => setFullOpen(true)} className="text-link">
                    contate nosso suporte
                </span>{" "}
                para trocar ideias.
            </p>
            <p>Link do documento das regras é acessado via:</p>
            {showLinkAndCTAs()}
            <p>
                Todos os seus clientes que fizeram seus cadastros concordaram
                com as regras do seu clube de compras.
            </p>
            <p>
                Eles possuem acesso ao documento atualizado a qualquer momento
                indo em <strong>mais > regras</strong> no menu principal
                inferior do app cliente.
            </p>
            {fullOpen && (
                <ModalFullContent
                    contentComp={<AsyncFiddelizeContact />}
                    fullOpen={fullOpen}
                    backgroundColor="var(--themeP)"
                    setFullOpen={handleFullClose}
                />
            )}
        </section>
    );
}

export default withRouter(BuyClubRules);
