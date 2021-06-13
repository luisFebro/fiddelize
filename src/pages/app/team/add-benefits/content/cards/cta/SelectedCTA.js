import ChooseDialogBtn from "./choose-dialog/ChooseDialogBtn";
import DiscountBenefitBtn from "./benefit/DiscountBenefitBtn";

export default function SelectedCTA(props) {
    const { allBenefitGames } = props;
    const count = allBenefitGames.length;

    if (count > 1) return <ChooseDialogBtn {...props} />;

    return <DiscountBenefitBtn {...props} />;
}
