import useData from "init";
import usePro from "init/pro";
import AddSMSBtn from "../../credits-balance/add-sms-btn/AddSMSBtn";

export default function AsyncNoCredits() {
    const { firstName } = useData();

    const showTitle = () => (
        <div className="mt-5">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Sem Créditos SMS.
            </p>
        </div>
    );

    const showIllustra = () => (
        <section className="my-5 mx-2">
            <img
                className="img-fluid"
                src="/img/illustrations/empty-sms-credits.svg"
                alt="sem créditos"
            />
        </section>
    );

    const showMsg = () => (
        <section className="mb-5 text-purple text-normal mx-3">
            Ei, parece que seu saldo está parado para envios. {firstName},
            invista e traga a <strong>força dos SMS</strong> para seu projeto.
        </section>
    );

    const { plan: currPlan } = usePro();

    const modalData = {
        isFromSession: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
    };

    const showCTA = () => (
        <section className="container-center my-5">
            <AddSMSBtn btnTitle="Investir" modalData={modalData} />
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
