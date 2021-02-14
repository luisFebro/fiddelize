import { useState, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    useProfile,
    useClientAdmin,
    useCentralAdmin,
} from "../../../../hooks/useRoleData";
import getFirstName from "../../../../utils/string/getFirstName";
import usePro from "../../../../hooks/pro/usePro";

import ModalFullContent from "../../../../components/modals/ModalFullContent";
import { Load } from "../../../../components/code-splitting/LoadableComp";

const AsyncAddCustomersContent = Load({
    loader: () =>
        import(
            "../../../../pages/plans-page/plan-modes/sessions/customer-packages/customer-btn/AsyncAddCustomersContent" /* webpackChunkName: "add-customers-full-page-lazy" */
        ),
});

const showTxtDefault = (txt) => (
    <div className="mx-2 text-left text-normal animated rubberBand my-5">
        <p className="text-purple text-subtitle font-weight-bold m-0">
            Nota <FontAwesomeIcon icon="info-circle" />
        </p>
        {txt}
    </div>
);

// EXPIRING MSGS
const aboutToExpireMsg = ({
    limitFreePlanNewUsers,
    totalClientUsers,
    name,
    handleOpenCustomerModal,
    modalData,
    handleCloseCustomerModal,
    openModal,
}) => {
    // const leftRegisters = limitFreePlanNewUsers - totalClientUsers;
    const txt = (
        <span>
            - Seus clientes estão começando a aparecer, {getFirstName(name)}.
            Ótimo! Faltam mais alguns cadastros na versão grátis. Que tal ganhar
            mais alcance e resultado?{" "}
            <div onClick={handleOpenCustomerModal} className="text-link">
                Invista em Novvos Clientes e fiddelize mais.
            </div>
        </span>
    );

    return (
        <Fragment>
            {showTxtDefault(txt)}
            {openModal && (
                <ModalFullContent
                    contentComp={
                        <AsyncAddCustomersContent modalData={modalData} />
                    }
                    fullOpen={handleOpenCustomerModal}
                    setFullOpen={handleCloseCustomerModal}
                />
            )}
        </Fragment>
    );
};

const expiredMsg = ({
    modalData,
    handleOpenCustomerModal,
    handleCloseCustomerModal,
    openModal,
}) => {
    const txt = (
        <section>
            - O limite de cadastros para seu plano terminou.
            <br />
            <div onClick={handleOpenCustomerModal} className="text-link">
                Invista em mais cadastros e continue fiddelizando.
            </div>
        </section>
    );
    return (
        <Fragment>
            {showTxtDefault(txt)}
            {openModal && (
                <ModalFullContent
                    contentComp={
                        <AsyncAddCustomersContent modalData={modalData} />
                    }
                    fullOpen={handleOpenCustomerModal}
                    setFullOpen={handleCloseCustomerModal}
                />
            )}
        </Fragment>
    );
};
// END EXPIRING MSGS

// Need to reload to update. And even after reloaded, there's a delay to update...
// insert bizPlan checking in the component which holds this.

export default function AsyncFreeAccountsLimitMsg() {
    const [openModal, setOpenModal] = useState(false);
    const { name } = useProfile();
    const { totalClientUsers } = useClientAdmin();
    const { limitFreePlanNewUsers } = useCentralAdmin();

    const { plan: currPlan, usageTimeEnd, credits } = usePro({
        service: "Novvos Clientes",
    });

    const modalData = {
        isCreditsBadge: true, // it will allow period choice and handle individual order
        currPlan: currPlan === "gratis" ? "bronze" : currPlan,
        expiryDate: usageTimeEnd,
    };

    const handleOpenCustomerModal = () => {
        setOpenModal(true);
    };

    const handleCloseCustomerModal = () => {
        setOpenModal(false);
    };

    if (totalClientUsers >= limitFreePlanNewUsers || !credits) {
        return expiredMsg({
            modalData,
            handleOpenCustomerModal,
            handleCloseCustomerModal,
            openModal,
        });
    }
    if (totalClientUsers >= 7) {
        return aboutToExpireMsg({
            limitFreePlanNewUsers,
            totalClientUsers,
            name,
            handleOpenCustomerModal,
            handleCloseCustomerModal,
            openModal,
            modalData,
        });
    }
    return null;
}
