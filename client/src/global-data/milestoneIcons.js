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
    },
    {
        ptBr: 'círculo',
        icon: "circle",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: 'diamante',
        icon: "gem",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: 'sol',
        icon: "sun",
        premium: false,
    },
    {
        ptBr: 'saduba',
        icon: "hamburger",
        premium: false,
    },
    {
        ptBr: 'tesoura',
        icon: "cut",
        premium: false,
    },
    {
        ptBr: 'sorvete',
        icon: "ice-cream",
        premium: false,
    },
    {
        ptBr: 'pet',
        icon: "paw",
        premium: false,
    },
    {
        ptBr: 'bebida',
        icon: 'cocktail',
        premium: false,
    },
    {
        ptBr: 'música',
        icon: "music",
        premium: false,
    },
    {
        ptBr: "tech",
        icon: "robot",
        premium: false,
    },
    {
        ptBr: "medalha",
        icon: "medal",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: "saúde",
        icon: "stethoscope",
        premium: false,
    },
    {
        ptBr: "automóvel",
        icon: "car",
        premium: false,
    },
    {
        ptBr: "vestuário",
        icon: "tshirt",
        premium: false,
    },
    {
        ptBr: "coroa",
        icon: "crown",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: "arte",
        icon: "dragon",
        premium: false,
    },
    {
        ptBr: "carinha",
        icon: "grin-hearts",
        premium: false,
        appPreview: true,
    },
    {
        ptBr: "negócios",
        icon: "user-tie",
        premium: false,
    },
    {
        ptBr: "fogo",
        icon: "fire",
        fontSize: "60px",
        premium: false,
    },
    {
        ptBr: "esporte",
        icon: "dumbbell",
        premium: false,
    },
    {
        ptBr: "entreten.",
        icon: "gamepad",
        premium: false,
    },
    {
        ptBr: "comida",
        icon: "apple-alt",
        premium: false,
    },
    {
        ptBr: "mercadorias",
        icon: "cart-plus",
        premium: false,
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