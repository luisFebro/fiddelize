import { useState } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import DeleteButton from "components/buttons/DeleteButton";
import ModalYesNo from "components/modals/ModalYesNo";

DeleteModalBtn.propTypes = {
    id: PropTypes.string,
    challengeNumber: PropTypes.number,
    updateLocalList: PropTypes.func,
};

export default function DeleteModalBtn({
    id,
    challengeNumber,
    updateLocalList,
    subject = "prêmio",
}) {
    const [fullOpen, setFullOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleDelete = (arrayId) => {
        updateLocalList({ deleteThisId: arrayId, needMsg: true });
    };

    return (
        <section>
            <DeleteButton onClick={() => setFullOpen(true)} />
            <ModalYesNo
                title={`Exclusão de ${subject}`}
                contentComp={
                    <DeleteContent
                        errorMsg={errorMsg}
                        challengeNumber={challengeNumber}
                        subject={subject}
                    />
                }
                fullOpen={fullOpen}
                setFullOpen={setFullOpen}
                actionFunc={() => handleDelete(id)}
            />
        </section>
    );
}

const DeleteContent = ({ subject, errorMsg, challengeNumber }) => {
    const txtStyle = "text-normal font-weight-bold text-left mx-3";

    return (
        <div>
            {errorMsg ? (
                <p className={`${txtStyle} text-red`}>
                    {errorMsg && parse(errorMsg)}
                </p>
            ) : (
                <p className={`${txtStyle} text-purple`}>
                    Confirmado a exclusão de
                    <br />
                    {subject} tipo {challengeNumber} ?
                </p>
            )}
        </div>
    );
};
