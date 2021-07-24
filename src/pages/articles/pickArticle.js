import articleStore from "./instructions/articleStore";

export default function pickArticle({
    article,
    // category = "instruction", // only used if there is the need for other categories to be managed...
    // options = {},
}) {
    const pickComp = () => articleStore[article];

    return pickComp;
}
