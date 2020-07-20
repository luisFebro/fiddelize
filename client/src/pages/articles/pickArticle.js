import { articleStore } from './instructions/articleStore';

export default function pickArticle({
    category = "instruction", // only used if there is the need for other categories to be managed...
    article = "GiftVisibility_art1",
    options = {},
}) {
    const pickComp = () => {
        return articleStore[article];
    }

    return pickComp;
}