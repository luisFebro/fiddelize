import { useState } from "react";
import useData, { useBizData } from "init";
import { convertBrToDollar } from "utils/numbers/convertDotComma";
import AddNewScoreBtn from "../../../../../../../../app/team/add-points/AddNewScoreBtn";

export default function AddScoreCTAs({ clientName, handleScoreToLink }) {
    const [data, setData] = useState({
        score: null,
    });
    const { score } = data;

    const [role] = useData(["role"]);
    const isCliAdmin = role === "cliente-admin";
    const { themeSColor: sColor, themeBackColor: backColor } = useBizData();

    const showScoreMsg = () => (
        <p className="text-purple text-normal mt-3 mx-3">
            Certo!{" "}
            <strong style={{ textDecoration: "underline" }}>
                {score} pontos
            </strong>{" "}
            serão adicionados na conta do cliente assim que ele(a) concluir o
            cadastro com o link gerado abaixo.
        </p>
    );

    const handleCustomerScore = (thisScore, thisCliName) => {
        setData({ ...data, score: thisScore });
        const dbScore = convertBrToDollar(thisScore);
        handleScoreToLink(dbScore, thisCliName);
    };

    return (
        <section className="mb-3 animated fadeInUp">
            <h2 className="text-subtitle font-weight-bold text-purple text-center">
                Cadastro com compra?
            </h2>
            <div className="container-center">
                <AddNewScoreBtn
                    registerBtnTitle={
                        score ? "Mudar Moedas" : "Adicionar Moedas"
                    }
                    backColor={isCliAdmin ? "default" : backColor}
                    sColor={isCliAdmin ? "default" : sColor}
                    clientScoreOnly
                    clientName={clientName}
                    handleCustomerScore={handleCustomerScore}
                />
            </div>
            {score && showScoreMsg()}
        </section>
    );
}
