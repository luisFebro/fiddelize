import ModalBtn from "../../../components/buttons/ModalBtn";
import Img from "../../../components/Img";

const isSmall = window.Helper.isSmallScreen();

const latestVersion = "4.4.0"; // PRÓXIMO:

const updateDescription = "atualizações lançamento - pt 5";

/* HISTORY
"pix - sistema completo de pagamento com suporte app equipe fiddelize pt2"
"biz team app - pay and automatic selling system - register associates - pt2"
  "biz docs - termos de uso e privacidade - e caixa de consentimento formulário"
  "warnings and QA testers fix and CRA4 || página qr code personalizado para convite baixar app || opçao de baixar qr code na pagina de compartilhar"
  "separação oficial do front e backend do projeto pt 4"
  "reverted to app membro - notificações e lista de clientes ganhadores",
  "copia de segurança avançada dos dados clientes - feito",
  "servico sattisfacao clientes - ponto promotores e nota XP pt4",
  "novo app - self-service - fluxo e criação pt 5",
  "site - marketing - design com diferenciais pt 4",
  "app instantâneo, painel de apps, sistema multi-apps pt 13",
  "credit card pay frontend pt16",
  "serviço novvos membros",
  "app membro - sistema de acesso",
  "segurança dos link de convite com pontos para baixar app",
  "cartão virtual 3D de fidelidade",
  "app da equipe",
  "sistema de acesso e senha",
  "sistema de planos - integração com serviços individuais",
  "planos e pagamentos - sistema e design de notificação pro",
  "club pro - cards de transação e design",
  "sistema de renovação",
  "página de planos",
  "sistema de pagamento PAGSEGURO - boleto automático",
  "fiddelize pro botão, painel e sistema pt2",
  "nova customização página de download, filtros, pesquisa premium",
  "painel de controle cliente-admin - painel de cadastros (staff), nova lista clientes cadastrados com rolagem infinita",
  "painel de controle cliente-admin - botão dinâmico adicionar clientes, página de adição de clientes pt3",
  "painel de controle cliente-admin - sessão SMS pt41 - finalizado",
  "página de notificações - otimização com rolagem infinita e ajustes finais (Finalizado)",
  "historico de compras - otimização com rolagem infinita e ajustes finais pt4 (finalizado) || docs",
  "novo artigo para card historico de cliente || melhorias algoritmo de cores (finalizado)",
  "sistema de lista de dados offline - gestão de dados e integração indexedDB com as listas para uso offline para lista automática de tarefas (finalizado)",
  "sistema de artigos (finalizado edição inicial)",
  "painel - sessão design - botão revelar prêmios e metas para clientes? (sempre revelado ou escondido durante desafios)",
  "Lista Automática de Tarefas - opção de excluir card se prêmio expirado (testando...)",
  "caixa de presente animada com design e algoritmos personalizados cronômetro do prazo de dias do resgate do prêmio || botão de acesso galeria de prêmios para cards no histórico",
  "painel de controle admin - lista automática de tarefas - rolagem infinita",
  "Galeria de Prêmios (finalizado)",
  "novo modelo de requisições HTTP - cliente com axios ",
  "Otimização completa do algoritmo do histórico de compra || otimização UI sessão histórico de compras pt 8 (finalizado)",
  "Componentes e Sistema de Notificações - integração de funciolidades interface, design finalizado",
  "Componentes e Sistema de Notificações - concluído implementação completa no backend",
  "Painel de Controle - simplificação processo card teste || melhorias teclado || algoritmo modo progressivo || melhorias no sistema de pontuação cli-admin || otimização algoritmo do historico de compras",
  "Login/Acesso - Novo status para verificar novidades em funcionalidades com página de atualização",
*/

const getStyles = () => ({
    root: {
        width: "200px",
    },
    versionBtn: {
        backgroundColor: "black",
        borderRadius: "30px",
        color: "white",
        padding: "4px 5px",
        fontSize: "18px",
        border: "3px solid white",
        marginBottom: "10px",
        marginLeft: "10px",
    },
    cta: {
        right: "-15px",
        top: "-20px",
    },
});

export default function AppVersion({ position = "relative", bottom, left }) {
    const styles = getStyles();

    return (
        <section className={`position-${position}`} style={{ bottom, left }}>
            <section className="position-relative mt-5" style={styles.root}>
                <main
                    style={styles.versionBtn}
                    className="app-version text-nowrap text-small text-center"
                >
                    Versão {latestVersion}
                </main>
                <div className="position-absolute" style={styles.cta}>
                    <ModalBtn modalComp={<FeatureUpdates />} />
                </div>
            </section>
        </section>
    );
}

function FeatureUpdates() {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Atualizações App
            </p>
        </div>
    );

    const showMainContent = () => (
        <div className="animated fadeInUp delay-1s">
            <header>
                <h1 className="text-title text-purple text-center mb-3">
                    Versão {latestVersion}
                </h1>
            </header>
            <div className="text-normal text-purple mx-3 mb-3">
                <h2 className="text-center text-subtitle">
                    Última Atualização:
                </h2>
                {updateDescription}
            </div>
        </div>
    );

    return (
        <>
            {showTitle()}
            <div className="container-center mx-3">
                <Img
                    className="img-fluid"
                    src="/img/illustrations/new.png"
                    offline
                    height="auto"
                    style={{
                        maxHeight: !isSmall ? "110px" : "120px",
                        width: "120px",
                    }}
                    alt="novidades"
                />
            </div>
            {showMainContent()}
        </>
    );
}
