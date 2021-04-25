import ButtonFab from "../../../../../../../components/buttons/material-ui/ButtonFab";
import "./_BankCard.scss";

export default function BankCard({ data, setMainData }) {
    const { name, displayName } = data;

    const showCTA = (bankName) => (
        <ButtonFab
            title="selecionar"
            variant="extended"
            size="small"
            position="relative"
            backgroundColor="var(--themeSDark--default)"
            onClick={() => {
                setMainData((prev) => ({
                    ...prev,
                    currComp: "linkBankDebit",
                    selectedBank: bankName,
                }));
            }}
        />
    );

    const showFooter = () => (
        <section className="card-footer">
            <p className="desc font-weight-bold">{displayName}</p>
            <div className="container-center">
                {showCTA(name.toUpperCase())}
            </div>
        </section>
    );

    return (
        <section
            className="col-6 mx-auto mb-4" // not using  col-md-4  col-lg-3 since it is in a modal, only 2 columns of 6 / 6 from 12
        >
            <section className="shadow-babadoo bank-card--root">
                <div className="img-container p-1 p-sm-3">
                    <img
                        src={
                            `/img/icons/bank-debits/${name}.jpg` ||
                            "/img/error.png"
                        }
                        alt={displayName}
                    />
                </div>
                {showFooter()}
            </section>
        </section>
    );
}
