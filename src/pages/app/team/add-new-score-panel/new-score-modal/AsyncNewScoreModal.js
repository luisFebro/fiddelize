import FieldsHandler from "./FieldsHandler";

export default function AsyncNewScoreModal({
    closeModal,
    clientScoreOnly = false, // quickRegister form
    clientName = false, // quickRegister form
    handleCustomerScore,
}) {
    return (
        <FieldsHandler
            closeModal={closeModal}
            clientScoreOnly={clientScoreOnly}
            clientName={clientName}
            handleCustomerScore={handleCustomerScore}
        />
    );
}
