import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadiusBtn from "components/buttons/RadiusBtn";
import getFirstName from "utils/string/getFirstName";
// import useData from "init";

export default function ShowBizNotes() {
    const [openNote, setOpenNote] = useState(false);

    // let { name } = useData();
    // name = getFirstName(name);

    return (
        <section className="text-center text-normal animated fadeIn">
            <div style={{ width: 200 }}>
                <p className="text-purple text-left text-subtitle font-weight-bold m-0">
                    Notas <FontAwesomeIcon icon="info-circle" />
                </p>
                <div className="position-relative" style={{ top: "-10px" }}>
                    <RadiusBtn
                        title={openNote ? "Fechar" : "Ver todas"}
                        onClick={() => setOpenNote(!openNote)}
                        size="extra-small"
                    />
                </div>
            </div>
            {openNote && (
                <p className="text-small text-left text-purple mt-3 animated fadeIn">
                    - Quando{" "}
                    <strong>um cliente finalizar todos os desafios</strong>{" "}
                    desta lista, o <strong>último desafio estipulado</strong>{" "}
                    será repetido na sequencia com o mesma meta em pontos,
                    descrição de prêmio e ícone de desafio.
                    <br />
                    <br />- Todos os clientes passam por{" "}
                    <strong>cada desafio desde o primeiro</strong>, de forma
                    personalizada e individual em cada app.
                    <br />
                    <br />- É preciso de pelo menos{" "}
                    <strong>um prêmio com metas e ícone</strong> enquanto este
                    jogo (prêmio alvo) estiver ativo.
                </p>
            )}
        </section>
    );
}

/* ARCHIVES

{limitFree && (
    <p className="text-center text-purple text-small">
        {name}, este foi seu <strong>último desafio.</strong> Na
        versão gratis, você pode adicionar até{" "}
        <strong>3 desafios no modo progressivo</strong>.
        <br />
        <Link
            to="/planos?cliente-admin=1"
            className="font-weight-bold"
        >
            Atualize hoje sua versão para adicionar mais desafios
            para seus clientes.
        </Link>
    </p>
)}

 */
