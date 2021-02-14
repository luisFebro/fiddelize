import GradientButton from "./GradientButton";

const dataInstagram = {
    img: "img/icons/buttonslogin/instagram.png",
    name: "instagram",
    href: "auth/instagram",
    alt: "instagram-icon",
    colors: {
        leftBot: "#fec564",
        leftTop: "#5258cf",
        rightTop: "#893dc2",
        rightBot: "#d9317a",
        baseCoat:
            "linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)",
    },
    color: "#d9317a",
    title: "Entrar com Instagram",
};

export default function InstagramAuth() {
    return <GradientButton app={dataInstagram} key={dataInstagram.name} />;
}
