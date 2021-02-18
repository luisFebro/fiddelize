import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import getFirstName from "../../../utils/string/getFirstName";
import { useProfile } from "../../../hooks/useRoleData";
import ButtonFab, {
    faStyleSmall,
} from "../../../components/buttons/material-ui/ButtonFab";
import useAnimateElem from "../../../hooks/scroll/useAnimateElem";

function PremiumServicesBtn({ history }) {
    const { name } = useProfile();
    useAnimateElem(".bottom-action-btn--biz", {
        animaIn: "backInRight",
        speed: "slow",
    });

    return (
        <section
            className="bottom-action-btns--root"
            style={{
                margin: "20px 0 50px 0",
            }}
        >
            <div className="bottom-action-btn--biz premium-btn">
                <ButtonFab
                    position="relative"
                    variant="extended"
                    textTransform="none"
                    title={`Turbine seu app, ${name && getFirstName(name)}`}
                    size="large"
                    onClick={() => history.push("/planos?cliente-admin=1")}
                    color="var(--mainWhite)"
                    backgroundColor="var(--niceUiYellow)"
                    iconFontAwesome={
                        <FontAwesomeIcon
                            className="animated rubberBand delay-5s"
                            icon="crown"
                            style={{
                                ...faStyleSmall,
                                animationIterationCount: 4,
                            }}
                        />
                    }
                />
            </div>
        </section>
    );
}

export default withRouter(PremiumServicesBtn);
