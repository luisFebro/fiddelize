import { useEffect, useState } from "react";
import Icon from "styles/Icon";
import showToast from "components/toasts";
import getAPI, { readBenefitCards } from "api";
import useData, { useBizData } from "init";
import getFirstName from "utils/string/getFirstName";
import ModalFullContent from "components/modals/ModalFullContent";
import { Load } from "components/code-splitting/LoadableComp";

const AsyncDiscountBenefit = Load({
    loading: true,
    loader: () =>
        import(
            "../benefit/DiscountBenefit" /* webpackChunkName: "discount-benefit-page-lazy" */
        ),
});

const AsyncChooseDialog = Load({
    loading: true,
    loader: () =>
        import(
            "../choose-dialog/ChooseDialog" /* webpackChunkName: "choose-benefit-dialog-page-lazy" */
        ),
});

export default function BenefitScannerHandler({ closeModal, scannerData }) {
    const [done, setDone] = useState(false);
    const [modal, setModal] = useState({
        modalOpen: false,
        countBenefits: 0,
        modalProps: {},
    });
    const { countBenefits, modalOpen, modalProps } = modal;

    const handleModalClose = () => {
        setModal((prev) => ({
            ...prev,
            modalOpen: false,
        }));
    };

    const { bizId, themePColor } = useBizData();
    const { userId } = useData();

    useEffect(() => {
        (async () => {
            if (!scannerData) {
                setDone(true);
                return showToast("Código QR não é válido ou já usado", {
                    type: "error",
                });
            }

            setDone(false);
            const data = await getAPI({
                url: readBenefitCards(),
                params: {
                    userId,
                    type: "pending",
                    adminId: bizId,
                    search: scannerData && scannerData.customerName,
                },
            });

            setDone(true);
            if (!data.list.length)
                return showToast(
                    "Código QR não é mais válido ou dados do cliente não encontrado",
                    { type: "error" }
                );

            // since we are searching for a single customer, then get the first item
            const {
                allAvailableBenefits,
                beatGameList,
                recordId,
                currPoints,
                customerId,
                gender,
            } = data.list[0];
            let { customerName } = data.list[0];
            customerName = getFirstName(customerName && customerName.cap(), {
                addSurname: true,
            });

            const availableBenefitsCount = beatGameList.length;

            if (!availableBenefitsCount) {
                showToast("Cliente sem benefícios a receber", {
                    type: "error",
                });
                setTimeout(() => closeModal(), 2000);
                return null;
            }

            const benefitProps = {
                allAvailableBenefits,
                allBenefitGames: beatGameList,
                closeModal: handleModalClose,
                closeScanner: closeModal,
                customerId,
                recordId,
                themePColor,
                customerName,
                currPoints,
                gender,
                gameName: beatGameList.length === 1 && beatGameList[0].game,
            };

            return setModal((prev) => ({
                ...prev,
                modalOpen: true,
                countBenefits: availableBenefitsCount,
                modalProps: benefitProps,
            }));
        })();

        // eslint-disable-next-line
    }, [scannerData, bizId]);

    return (
        <section className="full-height text-purple">
            <div className="container-center mt-5">
                <Icon
                    type="qrCodeScanner"
                    style={{
                        fontSize: "150px",
                        color: "var(--themeP)",
                    }}
                />
            </div>
            <p className="text-center text-subtitle font-weight-bold mx-3 mt-3">
                {done ? "Pronto!" : "Processando dados do cliente..."}
            </p>
            {modalOpen && (
                <ModalFullContent
                    contentComp={
                        countBenefits > 1 ? (
                            <AsyncChooseDialog {...modalProps} />
                        ) : (
                            <AsyncDiscountBenefit {...modalProps} />
                        )
                    }
                    fullOpen={modalOpen}
                    setFullOpen={handleModalClose}
                />
            )}
        </section>
    );
}
