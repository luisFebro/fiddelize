import { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/Title";
import { showComponent } from "../../../../redux/actions/componentActions";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import KeypadButton from "../../../../components/modals/keypad";
import isMoneyBrValidAndAlert from "../../../../utils/numbers/isMoneyBrValidAndAlert";
import { useBizData } from "init";
// import AddOrSearch from '../../../../components/search/AddOrSearch';

InsertValue.propTypes = {
    success: PropTypes.bool,
    setValuePaid: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 330,
    },
}));

const plan = "free";
export default function InsertValue({ success, setValuePaid }) {
    const [valuePaid, setData] = useState("0,0");
    // const [searchData, setSearchData] = useState({
    //     buyDesc: '',
    // })

    const { themePColor, themeSColor } = useBizData();

    const classes = useStyles();
    const dispatch = useStoreDispatch();

    const handleSwitch = (valuePaid) => {
        if (!isMoneyBrValidAndAlert(valuePaid, showSnackbar, dispatch)) {
            return;
        }
        if (success) {
            setValuePaid(valuePaid);
            showComponent(dispatch, "staffConfirmation");
        }
    };

    const showTitle = () => (
        <Title
            title="Informações da compra"
            color="var(--mainWhite)"
            needShadow
            backgroundColor={`var(--themePDark--${themePColor})`}
        />
    );

    const showKeypadButton = () => (
        <div className="animated fadeInDown normal d-flex justify-content-center mt-1 mb-4">
            <KeypadButton
                title="Insira o valor gasto"
                titleIcon={<FontAwesomeIcon icon="money-bill-alt" />}
                setSelectedValue={setData}
                confirmFunction={handleSwitch}
                backgroundColor={`var(--themeSDark--${themeSColor})`}
            />
        </div>
    );

    const showSearch = () => <div className="mt-3 margin-auto-95 d-none" />;

    return (
        <div className="animated zoomIn fast mt-5 card-elevation">
            <Card className={classes.card}>
                {showTitle()}
                <section className="text-p text-normal">
                    {plan !== "free" && (
                        <Fragment>
                            <div className="ml-2 font-weight-bold mt-2">
                                Informe Descrição:
                            </div>
                            {showSearch()}
                        </Fragment>
                    )}
                    <div
                        className={`ml-2 font-weight-bold ${
                            plan !== "free" ? "mt-5" : "mt-2"
                        }`}
                    >
                        Insira Valor da Compra:
                    </div>
                    {showKeypadButton()}
                    {plan !== "free" && (
                        <div className="text-small ml-2">
                            *valores serão registrados após validação.
                        </div>
                    )}
                </section>
            </Card>
        </div>
    );
}

/* ARCHIVES
<AddOrSearch
    autoCompleteUrl= "CHANGE/api/finance/staff/list/names?role=cliente"
    setSearchData= {setSearchData}
    searchData= {searchData}
/>
 */
