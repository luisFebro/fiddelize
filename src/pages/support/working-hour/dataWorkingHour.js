const FIXED_HOURS = {
    from: 9,
    to: 18,
};

const data = [
    {
        weekDay: "Domingo",
        closeDay: true,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Segunda-Feira",
        closeDay: false,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Terça-Feira",
        closeDay: false,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Quarta-Feira",
        closeDay: false,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Quinta-Feira",
        closeDay: false,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Sexta-Feira",
        closeDay: false,
        ...FIXED_HOURS,
    },
    {
        weekDay: "Sábado",
        closeDay: false,
        ...FIXED_HOURS,
    },
];

export default data;
