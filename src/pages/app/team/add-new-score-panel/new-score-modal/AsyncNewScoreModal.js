import FieldsHandler from "./FieldsHandler";

export default function AsyncNewScoreModal({
    closeModal,
    clientScoreOnly = false, // quickRegister form only
    clientName = false, // quickRegister form only
    handleCustomerScore, // quickRegister form only
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
