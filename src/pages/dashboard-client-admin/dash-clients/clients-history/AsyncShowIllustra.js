import Img from "../../../../components/Img";
import RegisterPanelBtn from "./register-panel-btn/RegisterPanelBtn";

const handleData = (type) => {
    let src;
    let btnTitle;
    let alt;
    let title;

    if (type === "filter") {
        btnTitle = "ADICIONE MAIS";
        src = "/img/illustrations/empty-filter.svg";
        alt = "resultado vazio filtro clientes";
        title = "Nenhum cliente adicionado neste período";
    }
    if (type === "search") {
        btnTitle = "NOVA BUSCA";
        src = "/img/illustrations/empty-search.svg";
        alt = "resultado vazio pesquisa clientes";
        title = "Esse termo é novo, hein? Nada encontrado.";
    }
    if (type === "virgin") {
        btnTitle = "CADASTRE O PRIMEIRO";
        src = "/img/illustrations/empty-recorded-customers.svg";
        alt = "sem clientes cadastrados";
        title =
            "Comece a elevar a experiência de compra de seus clientes hoje.";
    }

    return {
        src,
        alt,
        title,
        btnTitle,
    };
};

export default function AsyncShowIllustra({ emptyType }) {
    const { src, alt, title, btnTitle } = handleData(emptyType);

    return (
        <section>
            <Img
                className="img-fluid"
                src={src}
                offline
                alt={alt}
                title={title}
            />
            <div className=" mb-5 container-center">
                <RegisterPanelBtn title={btnTitle} />
            </div>
        </section>
    );
}
