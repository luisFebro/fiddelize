import setProRenewal from "utils/biz/setProRenewal";
import { withRouter } from "react-router-dom";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import usePro from "init/pro";

// this renewal is supposed to be mainly for handled expired plans
// mainItemList is always empty array if not expired here so the mainItemList doesn't load every time.
function ProRenewalBtn({
    history,
    title = "Renovar",
    width = undefined,
    size = "large",
}) {
    // Remember: mainItemList doesn't increase its value because this is done with the database with $inc
    const {
        mainItemList,
        plan,
        planMainItemList,
        periodMainItemList,
        periodEn,
        isProExpBlock2,
    } = usePro();

    const reachedMaxBlockLevel = plan === "gratis" && isProExpBlock2;
    const handleRenewal = async () => {
        await setProRenewal({
            itemList: mainItemList,
            // force the plan to be from mainItemList since after isProExpBlock2 is true - the last func block - the plan is officially free, but we still have all the renewal btns that will have wrongly a "free" renewal in ther order page
            planBr: reachedMaxBlockLevel ? planMainItemList : plan,
            investAmount: mainItemList.length
                ? mainItemList.reduce((acc, next) => acc + next.amount, 0)
                : 0,
            period: reachedMaxBlockLevel ? periodMainItemList : periodEn,
        });

        return history.push("/pedidos/admin");
    };

    return (
        <ButtonFab
            title={title}
            backgroundColor="var(--themeSDark)"
            onClick={handleRenewal}
            position="relative"
            variant="extended"
            size={size}
            width={width}
        />
    );
}

export default withRouter(ProRenewalBtn);
