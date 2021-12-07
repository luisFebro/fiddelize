export default function getSubjectBr(subject) {
    if (subject === "suggestion") return "sugestão";
    if (subject === "question") return "dúvida";
    if (subject === "compliment") return "elogio";
    if (subject === "usageHelp") return "ajuda de uso";
    if (subject === "bugReport") return "relato de falha";

    return "outros";
}
