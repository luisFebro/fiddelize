import convertToReal from "utils/numbers/convertToReal";
import { calendar } from "utils/dates/dateFns";
import PhotoBtn from "./photo/PhotoBtn";

export default function MonthlyCostsCard({ data }) {
    const { _id, desc, value, receiptImg, createdAt } = data;

    const investedValue = convertToReal(value, { moneySign: true });
    const registerDate = createdAt && calendar(createdAt);

    const showPhotoBtn = () => {
        const uploadData = {
            imgId: _id,
            savedImg: receiptImg,
        };

        return <PhotoBtn modalData={uploadData} />;
    };

    return (
        <div className="position-relative my-3 text-normal text-white monthly-costs-card--root">
            <h2 className="text-normal text-white">{desc}</h2>
            <p className="text-subtitle">{investedValue}</p>
            <p className="m-0 text-small">Registrado {registerDate}</p>
            <div className="position-absolute target-prize-photo-btn">
                {showPhotoBtn()}
                <style jsx global>
                    {`
                        .target-prize-photo-btn {
                            top: ${receiptImg ? "10px;" : "35px;"}
                            right: 30px;
                        }
                    `}
                </style>
            </div>
            <style jsx>
                {`
                    .monthly-costs-card--root {
                        background-color: var(--themeP);
                        border-radius: 20px;
                        padding: 10px;
                    }
                `}
            </style>
        </div>
    );
}
