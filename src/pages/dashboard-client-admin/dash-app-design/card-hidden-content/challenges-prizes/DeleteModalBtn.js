import React, { useState } from 'react';
import DeleteButton from '../../../../../components/buttons/DeleteButton';
import { useAppSystem } from '../../../../../hooks/useRoleData';
import { gotUsersInThisChallenge } from '../../../../../redux/actions/userActions';
import ModalYesNo from '../../../../../components/modals/ModalYesNo';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

DeleteModalBtn.propTypes = {
    id: PropTypes.string,
    challengeNumber: PropTypes.number,
    updateThisUser: PropTypes.func,
}

export default function DeleteModalBtn({ id, challengeNumber, updateThisUser }) {
    const [fullOpen, setFullOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { businessId } = useAppSystem();

    const handleDelete = arrayId => {
        const currChallInd = challengeNumber - 1;
        gotUsersInThisChallenge(businessId, currChallInd)
        .then(res => {
            if(res.status !== 200) return console.log("Something went wrong with gotUsersInThisChallenge request")
            if(typeof res.data === "number") {
                setErrorMsg(`Não é possível excluir.<br />Tem ${res.data} cliente(s) neste desafio.`);
            } else {
                updateThisUser(false, {deleteThisId: arrayId});
            }
        })
    }

    return (
        <section>
            <DeleteButton
                onClick={() => setFullOpen(true)}
            />
            <ModalYesNo
                title="Exclusão de desafio"
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

    return(
        <div>
            {errorMsg ? (
                <p className={txtStyle + " text-red"}>
                    {errorMsg && parse(errorMsg)}
                </p>
            ) : (
                <p className={txtStyle + " text-purple"}>
                    Confirmado a exclusão do
                    <br />
                    desafio n.º {challengeNumber} ?
                </p>
            )}
        </div>
    );
}
