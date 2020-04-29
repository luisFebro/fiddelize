// import sortObjKeyInArrayAlphabet from '../utils/arrays/sortObjKeyInArrayAlphabet';
// icones fontawesome premium ficaráo disponíveis no seu painel de controle após atualização do seu plano.

export const milestoneIcons = [
    {
        ptBr: 'estrela',
        icon: "star", // n1
        fontSize: "60px",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: 'coração',
        icon: "heart",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: 'círculo',
        icon: "circle",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: 'diamante',
        icon: "gem",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: 'sol',
        icon: "sun",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'saduba',
        icon: "hamburger",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'tesoura',
        icon: "cut",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'sorvete',
        icon: "ice-cream",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'pet',
        icon: "paw",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'bebida',
        icon: 'cocktail',
        premium: false,
        fontSize: "",
    },
    {
        ptBr: 'música',
        icon: "music",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "tech",
        icon: "robot",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "medalha",
        icon: "medal",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: "saúde",
        icon: "stethoscope",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "automóvel",
        icon: "car",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "vestuário",
        icon: "tshirt",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "coroa",
        icon: "crown",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: "arte",
        icon: "dragon",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "carinha",
        icon: "grin-hearts",
        premium: false,
        appPreview: true,
        fontSize: "",
    },
    {
        ptBr: "negócios",
        icon: "user-tie",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "fogo",
        icon: "fire",
        fontSize: "60px",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "esporte",
        icon: "dumbbell",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "entreten.",
        icon: "gamepad",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "comida",
        icon: "apple-alt",
        premium: false,
        fontSize: "",
    },
    {
        ptBr: "mercadorias",
        icon: "cart-plus",
        premium: false,
        fontSize: "",
    }
];

const iconNamesOnly = [];
for(let item of milestoneIcons) {
    iconNamesOnly.push(item.icon);
}

export { iconNamesOnly };
// console.log("Number of icons is " + milestoneIcons.length) // last 25

// this will be a separated file because it is sorting the original array when exportinh..
// const sortedMilestoneIcons = sortObjKeyInArrayAlphabet(milestoneIcons, "ptBr");

// export { sortedMilestoneIcons };