import BackButton from "components/buttons/BackButton";

export default function DiscountBackOptions({ setComp }) {
    const showBackBtn = () => (
        <div className="d-flex justify-content-start">
            <BackButton title="Voltar Opções" onClick={() => setComp(null)} />
        </div>
    );

    return (
        <section className="hidden-content--root text-normal">
            {showBackBtn()}
        </section>
    );
}
