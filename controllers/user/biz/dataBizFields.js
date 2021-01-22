// ramo de atividade comercial - tipos de negócios
// área de atuação - mais ligado a profissão.
const fieldsData = [
    "academia / serviços de personal trainer",
    "açougues",
    "educação / aulas",
    "abatedouros / matadouros",
    "agricultura / pecuária / piscicultura",
    "agencias",
    "aluguel / locação",
    "armazenagem",
    "arte / antiguidades",
    "artigos religiosos",
    "assessorias",
    "assinaturas e revistas",
    "assistência técnica / instalações",
    "associações",
    "automóveis / veículos / oficina",
    "autônomo",
    "bancos de sangue",
    "bebês e cia",
    "biblioteca",
    "blu-ray",
    "brindes / materiais promocionais",
    "brinquedos e games",
    "cartório",
    "casa e decoração",
    "casa lotérica",
    "celulares e telefonia",
    "cestas / presentes",
    "chaveria",
    "clínica de saúde",
    "colecionáveis",
    "comida e bebidas / restaurantes e similares",
    "compras coletivas",
    "corretagem",
    "cosméticos e perfumaria",
    "cursos e educação",
    "discos de vinil",
    "distribuidora",
    "cds / dvds",
    "eletrônicos / eletrodomésticos",
    "emissoras de rádio",
    "emissoras de televisão",
    "empregos",
    "empresas de telemarketing",
    "entidades públicas",
    "escritório de advocacia / serviço advocatícios",
    "estetica",
    "feira livre",
    "festas / eventos",
    "fotografia",
    "funerário",
    "gráficas / editoriais",
    "hd-dvd",
    "hipermercados / mercados / minimercados",
    "hospedagem / turismo",
    "igrejas / templos / instituições religiosas",
    "inflaveis promocionais",
    "ingressos",
    "instrumentos musicais",
    "jardinagem / floricultura / paisagismo",
    "joalheria",
    "lazer",
    "ld",
    "leilões",
    "livros",
    "logistica",
    "marcenaria / serralheria / vidraçaria",
    "materiais de construção / ferramentas / reparos",
    "md",
    "moda / confecções",
    "motéis",
    "móveis",
    "música digital",
    "oticas",
    "natal",
    "outros serviços",
    "padaria",
    "papelaria e escritório",
    "pet shop",
    "páscoa",
    "recreação e lazer",
    "relojoaria",
    "roupas / manutenção de roupas",
    "salão de beleza",
    "sapataria",
    "serviços administrativos",
    "serviços artísticos",
    "serviços de aeroportos",
    "serviços de arquitetura",
    "serviços de consultorias",
    "serviços de consórcios",
    "serviços de cooperativas",
    "serviços dentários",
    "serviços de despachante",
    "serviços de engenharia",
    "serviços de entregas",
    "serviços de estacionamentos",
    "serviços de estaleiros",
    "serviços de exportação / importação",
    "serviços de geólogos",
    "serviços de limpeza",
    "serviços de loja de conveniência",
    "serviços de mão de obra",
    "serviços de pesquisas",
    "serviços de portos",
    "serviços de seguradoras",
    "serviços de segurança",
    "serviços de sinalização",
    "serviços de sindicatos / federações",
    "serviços de traduções",
    "serviços de utilidade pública",
    "serviços em cine / som",
    "serviços em comunicação",
    "serviços em ecologia / meio ambiente",
    "serviços em eletroeletrônica / metal mecânica",
    "serviços em telefonia",
    "serviços esotéricos / místicos",
    "serviços financeiros",
    "serviços gerais",
    "serviços para deficientes",
    "serviços para escritórios",
    "serviços socias / assistenciais",
    "sex shop / conteúdo adulto",
    "shopping centers",
    "tabacaria",
    "tarifas bancárias",
    "tarifas telefônicas",
    "tatuaria",
    "taxi / transporte",
    "tecnologia / internet / informática / e-commerce",
    "telecomunicações",
    "telefonia",
    "venda a domicilio",
];

async function getData(data) {
    const { search, limit = 7 } = data;

    if (!search) return [];

    const run = (resolve, reject) => {
        const data = fieldsData.filter((elem) => {
            return elem.toLowerCase().includes(search.toLowerCase());
        });

        const finalRes = data.slice(0, limit);

        resolve(finalRes);
    };

    return new Promise(run);
}

// get - área de atuação for cli-admin pre-register.
exports.getBizFields = async (req, res) => {
    const data = await getData(req.query);
    res.json(data);
};

// (async () => {
//     const res = await getBizFields({ search: "mec" });
//     // [ 'Borracheiro/Mecanico/Funilaria/Pintura' ]
// })()
