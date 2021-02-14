import { useProfile, getFirstName } from "../../../../../hooks/useRoleData";
import AddSMSBtn from "../../credits-balance/add-sms-btn/AddSMSBtn";
import usePro from "../../../../../hooks/pro/usePro";

export default function AsyncChargeCredits({ currBalance, totalRecipients }) {
    const { name } = useProfile();

    const showTitle = () => (
        <div className="mt-5">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Créditos Insuficientes
            </p>
        </div>
    );

    const showIllustra = () => (
        <section className="my-5 mx-2">
            <img
                className="img-fluid"
                src="/img/illustrations/sms-charge.svg"
                alt="sem créditos"
            />
        </section>
    );

    const showMsg = () => (
        <section className="mb-5 text-purple text-normal mx-3">
            Poxa, {getFirstName(name)}! Seu{" "}
            <strong>saldo de {currBalance} créditos</strong> não é suficiente
            para {totalRecipients} envios.
            <br />
            <br />
            Recarregue seus créditos ou continue enviando para mais{" "}
            {currBalance} contatos.
        </section>
    );

    const { plan: currPlan } = usePro();

    const modalData = {
        isFromSession: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
    };

    const showCTA = () => (
        <section className="container-center my-5">
            <AddSMSBtn btnTitle="Recarregar" modalData={modalData} />
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showIllustra()}
            {showMsg()}
            {showCTA()}
        </section>
    );
}
