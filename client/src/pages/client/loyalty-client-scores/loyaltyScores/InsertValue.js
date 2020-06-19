import React, { useState, Fragment } from 'react';
import Title from '../../../../components/Title';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreDispatch } from 'easy-peasy';
import Card from '@material-ui/core/Card';
import { showComponent } from '../../../../redux/actions/componentActions';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import PropTypes from 'prop-types';
import KeypadButton from '../../../../components/modals/keypad';
import isMoneyBrValidAndAlert from '../../../../utils/numbers/isMoneyBrValidAndAlert';
import AddOrSearch from '../../../../components/search/AddOrSearch';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClientAdmin } from '../../../../hooks/useRoleData'

InsertValue.propTypes = {
    success: PropTypes.bool,
    setValuePaid: PropTypes.func,
}

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 330,
  }
}));

const plan = "free";
export default function InsertValue({ success, setValuePaid }) {
    const [valuePaid, setData] = useState("0,0");
    const [searchData, setSearchData] = useState({
        buyDesc: '',
    })

    const { selfThemePColor, selfThemeSColor } = useClientAdmin();

    const classes = useStyles();
    const dispatch = useStoreDispatch();

    const handleSwitch = valuePaid => {
        if(!isMoneyBrValidAndAlert(valuePaid, showSnackbar, dispatch)) {
            return;
        }
        if(success) {
            setValuePaid(valuePaid);
            showComponent(dispatch, 'staffConfirmation')
        }
    };

    const showTitle = () => (
        <Title
            title="Informações da compra"
            color="var(--mainWhite)"
            needShadow={true}
            backgroundColor={"var(--themePDark--" + selfThemePColor + ")"}
        />
    );

    const showKeypadButton = () => (
        <div className="animated fadeInDown normal d-flex justify-content-center mt-1 mb-4">
            <KeypadButton
                title="Insira o valor gasto"
                titleIcon={<FontAwesomeIcon icon="money-bill-alt" />}
                setSelectedValue={setData}
                confirmFunction={handleSwitch}
                backgroundColor={"var(--themeSDark--" + selfThemeSColor + ")"}
            />
        </div>
    );

    return (
        <div
            className='animated zoomIn fast mt-5 card-elevation'
        >
            <Card className={classes.card}>
                {showTitle()}
                <section className="text-p text-normal">
                    {plan !== "free" && (
                        <Fragment>
                            <div className="ml-2 font-weight-bold mt-2">
                                Informe Descrição:
                            </div>
                            <div className="mt-3 margin-auto-95">
                                <AddOrSearch
                                    autoCompleteUrl= "CHANGE/api/finance/staff/list/names?role=cliente"
                                    setSearchData= {setSearchData}
                                    searchData= {searchData}
                                />
                            </div>
                        </Fragment>
                    )}
                    <div className={`ml-2 font-weight-bold ${plan !== "free" ? "mt-5" : "mt-2"}`}>
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