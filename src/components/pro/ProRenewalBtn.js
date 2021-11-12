import setProRenewal from "utils/biz/setProRenewal";
import { withRouter } from "react-router-dom";
import RadiusBtn from "components/buttons/RadiusBtn";
import usePro from "init/pro";

// this renewal is supposed to be mainly for handled expired plans
// mainItemList is always empty array if not expired here so the mainItemList doesn't load every time.
function ProRenewalBtn({ history, title = "Renovar" }) {
    // Remember: mainItemList doesn't increase its value because this is done with the database with $inc
    const { mainItemList, plan, periodEn } = usePro();

    const handleRenewal = async () => {
        await setProRenewal({
            itemList: mainItemList,
            planBr: plan,
            investAmount: mainItemList.length
                ? mainItemList.reduce((acc, next) => acc + next.amount, 0)
                : 0,
            period: periodEn,
        });

        return history.push("/pedidos/admin");
    };

    return (
        <RadiusBtn
            title={title}
            onClick={handleRenewal}
            backgroundColor="var(--themeSDark)"
            padding="5px 10px"
            fontSize="18px"
            color="#fff"
        />
    );
}

export default withRouter(ProRenewalBtn);
