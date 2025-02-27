import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Img from "components/Img";
import { gameIconsStore } from "components/biz/GamesBadge";

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function Trophy({ data }) {
    const {
        gameType = "targetPrize",
        isDelivered = true,
        benefitDesc = "Um par de ingressos",
        isExpired = false,
    } = data;

    const isTypeCustom = true;

    const showIconStatus = (status, needExpired) => {
        const expiredCss = needExpired && isExpired ? "expired" : "";
        return status ? (
            <FontAwesomeIcon icon="check" className="ok-icon" />
        ) : (
            <FontAwesomeIcon
                icon="times"
                className={`pending-icon ${expiredCss}`}
            />
        );
    };

    const showPrizeStatusIcons = () => (
        <section
            className={`${
                isTypeCustom ? undefined : "d-none"
            } prize-status-icons`}
        >
            <section className="delivered">
                <div className="status-icon">
                    {showIconStatus(isDelivered, true)}
                </div>
                <div
                    className={`icon ${isDelivered ? "ok" : "pending"} ${
                        isExpired ? "expired" : ""
                    }`}
                >
                    <FontAwesomeIcon
                        icon="hand-holding"
                        className={`${
                            isDelivered || isExpired ? "shadow" : ""
                        }`}
                    />
                </div>
            </section>
        </section>
    );

    const description = benefitDesc && truncate(benefitDesc, 18);
    return (
        <section className="trophy--root">
            <section className="trophy-design">
                <div className="d-block">
                    <Img
                        mode="skeleton"
                        skelWidth={125}
                        src="/img/icons/trophies/gallery-trophy.svg"
                        className={
                            isTypeCustom ? "shadow-elevation-black" : undefined
                        }
                        alt="troféu"
                        width={150}
                        height="auto"
                    />
                </div>
                <div
                    className="custom-icon"
                    style={{
                        filter: `${
                            isTypeCustom
                                ? "drop-shadow(.01em 2px .01em grey)"
                                : ""
                        }`,
                    }}
                >
                    {gameIconsStore[gameType]}
                </div>
                {showPrizeStatusIcons()}
            </section>
            <section
                className={`${
                    isTypeCustom ? "text-purple" : "text-grey"
                } prize-desc text-normal text-center`}
            >
                {description}
            </section>
        </section>
    );
}
