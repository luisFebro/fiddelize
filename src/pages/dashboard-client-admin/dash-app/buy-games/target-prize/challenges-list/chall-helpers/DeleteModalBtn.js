import { useState } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import DeleteButton from "components/buttons/DeleteButton";
import { useBizData } from "init";
import ModalYesNo from "components/modals/ModalYesNo";

DeleteModalBtn.propTypes = {
    id: PropTypes.string,
    challengeNumber: PropTypes.number,
    updateThisUser: PropTypes.func,
};

export default function DeleteModalBtn({
    id,
    challengeNumber,
    updateThisUser,
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { bizId } = useBizData();

    const handleDelete = (arrayId) => {
        updateThisUser(true, { deleteThisId: arrayId });
    };

    return (
        <section>
            <DeleteButton onClick={() => setFullOpen(true)} />
            <ModalYesNo
                title="Exclusão de prêmio"
                contentComp={
                    <DeleteContent
                        errorMsg={errorMsg}
                        challengeNumber={challengeNumber}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
                actionFunc={() => handleDelete(id)}
            />
        </section>
    );
}

const DeleteContent = ({ errorMsg, challengeNumber }) => {
    const txtStyle = "text-normal font-weight-bold text-left mx-3";

    return (
        <div>
            {errorMsg ? (
                <p className={`${txtStyle} text-red`}>
                    {errorMsg && parse(errorMsg)}
                </p>
            ) : (
                <p className={`${txtStyle} text-purple`}>
                    Confirmado a exclusão do
                    <br />
                    prêmio n.º {challengeNumber} ?
                </p>
            )}
        </div>
    );
};
