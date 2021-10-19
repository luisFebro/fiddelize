import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ListAltIcon from "@material-ui/icons/ListAlt";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AmpStoriesIcon from "@material-ui/icons/AmpStories";
import CropFreeIcon from "@material-ui/icons/CropFree";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import FilterListIcon from "@material-ui/icons/FilterList";
import { proVersion } from "./proVersion";
// import StorageIcon from "@material-ui/icons/Storage";
// import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";

const integratedServices = (styles) => [
    {
        name: `
            <strong>2 Jogos de compra</strong><br />completos com desafios<br />ilimitados para clientes:<br />
            - Prêmio Alvo;<br />
            - Desconto Retornado;<br />
        `,
        Icon: <SportsEsportsIcon style={styles.muStyle} />,
        customIcon: "",
        cardDesc: "",
    },
    {
        name: `
            <strong>Moeda Digital PTS</strong><br />
            exclusiva de pontos para<br /> a troca de benefícios<br />com
            gestão mais completa<br />do mercado:<br />
            - adicionar;<br />
            - doar (aniversário clientes);<br />
            - descontar (incluso<br />escaneador código QR);<br />
            - remover;<br />
            - expirar moedas;<br />
            - histórico de transações<br />em todos apps;
        `,
        Icon: <FontAwesomeIcon icon="coins" style={styles.muStyle} />,
        customIcon: "",
        cardDesc: "",
    },
    {
        name: `
            <strong>Avaliação de clientes</strong><br />
            para conhecer a opinião<br />da clientela sobre seu <br />negócio a cada compra:<br />
            - métrica de fidelidade<br />(baseado no NPS);<br />
            - nota experiência<br />de compra;<br/>
            - relatos de compra<br />do cliente;<br />
            - relatórios e resultado<br />das avaliações para admin;
        `,
        Icon: <FindInPageIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name: `
            <strong>Links e Convites</strong><br />para clientes se registrar<br />e participar do seu clube<br />de compra direto dos<br />seus dispositivos:<br />
            - Links Cadastráveis com<br />opção de enviar moedas;<br />
            - Convites Personalizados<br />com sua logo e cores;`,
        Icon: <MailOutlineIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name: `
            <strong>Gestão de benefícios</strong><br />para saber em um só lugar:<br />
            - clientes com benefícios<br />
            disponíveis para resgate;<br />
            - confirmar benefícios pelo<br />
            nome cliente, ou <br />comprovante digital<br />
            com opção de código QR;<br />
            - histórico de recebimentos;<br />
        `,
        Icon: <ListAltIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name: `
            <strong>Filtros de compra</strong><br />
            para conhecer fatos sobre<br />
            carteira de clientes como<br />
            maiores valores de compra<br />
            por clientes, saldo ativo,<br />
            últimas compras e mais!
        `,
        Icon: <FilterListIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name: `
            <strong>App do cliente</strong><br />
            completo, sem anúncios e<br />
            personalizado com sua<br />
            marca com destaques:<br />
            - jogos de compras:<br />
            cliente acumula moedas,<br />
            participa dos jogos
            <br />que você ativar;<br />
            - cartão de compra<br />
            com moedas: seu cliente<br />
            recebe um a cada compra<br />
            que é adicionado moedas;<br />
            - histórico de compras;<br />
            - galeria de benefícios;<br />
            - suporte para seu negócio<br />via Whatsapp;<br />
        `,
        Icon: <PhoneAndroidIcon style={styles.muStyle} />,
        price: null,
    },
    {
        name: `<strong>2 Pódios do clube:</strong><br />
            -compra: conheça quem <br />são os clientes que <br />compram mais;<br />
            -equipe: membros com<br />mais cadastros de<br />clientes ou moedas`,
        Icon: <AmpStoriesIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name:
            "<strong>Código QR personalizado</strong><br />com sua logo e cor<br />para divulgação com<br />opção para baixar",
        Icon: <CropFreeIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
    {
        name:
            "<strong>Cópia da base de dados</strong><br />Você tem acesso a<br />cópia dos dados de <br />toda sua base de<br />clientela e pode ser baixada<br />a qualquer momento em formato Excel.<br />Dados incluem informações<br />de cadastro do cliente,<br />saldo em PTS, notas<br />de avaliações e quem<br />fez o cadastro.",
        Icon: <CropFreeIcon style={styles.muStyle} />,
        price: null,
        greyedout: false,
    },
];

const styles = {
    muStyle: {
        transform: "scale(1.5)",
        marginRight: "10px",
        color: "var(--themeP)",
    },
    muStyleGrey: {
        transform: "scale(1.5)",
        marginRight: "10px",
        color: "grey",
    },
};

export default function getServices(version = "integrated", options = {}) {
    const { total = false, period, plan } = options;

    if (plan === "bronze")
        return proVersion(styles).filter((serv) => serv.name);

    // get total plan only!
    if (total && (plan === "gold" || plan === "silver")) {
        let newCount = 0;
        const newAmount = proVersion(styles).reduce((acc, next) => {
            const thisPrice = next[plan].price[period];
            if (thisPrice) newCount++;

            return acc + thisPrice;
        }, 0);

        return { newCount, newAmount };
    }

    if (version === "integrated") return integratedServices(styles);
    if (version === "pro") return proVersion(styles);
}

/* ARCHIVES

{
    name: `
        <strong>2 Tipos de apps gestão:</strong><br />
        - para admin: você no<br />controle das principais<br />prefências dos apps;<br />
        - para membros: sua<br />equipe ajuda a cadastrar<br />novos clientes, moedas PTS<br />e benefícios;
    `,
    Icon: <ImportantDevicesIcon style={styles.muStyle} />,
    price: null,
    greyedout: false,
},


const offplanVersion = () => [
    {
        title: "Sattisfação Clientes",
        img: "/img/pro-features/sattisfacao-clientes/sattisfacao-clientes.svg",
        desc:
            "Use uma métrica eficaz para pesquisa de satisfação dos clientes.", // "Use uma métrica aprovada pelas melhores empresas para medir a satisfação dos seus clientes",
        bronze: {
            price: {
                yearly: 80,
                monthly: 40,
            },
        },
        silver: {
            price: {
                yearly: 70,
                monthly: 35,
            },
        },
        gold: {
            price: {
                yearly: 60,
                monthly: 30,
            },
        },
        proPage: "SattisfacaoClientes",
    },
    {
        title: "Coppia Segurança",
        img: "/img/pro-features/coppia-seguranca/coppia-seguranca.svg",
        desc: "Baixe os cadastros dos seus clientes para Excel",
        bronze: {
            price: {
                yearly: 60,
                monthly: 30,
            },
        },
        silver: {
            price: {
                yearly: 50,
                monthly: 25,
            },
        },
        gold: {
            price: {
                yearly: 40,
                monthly: 20,
            },
        },
        proPage: "CoppiaSeguranca",
    },
];

*/
