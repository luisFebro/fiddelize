import React, { useState, useEffect } from 'react';
import BigActionButton from '../../../../components/buttons/big-action-button/BigActionButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import { CLIENT_URL } from '../../../../config/clientUrl.js';
import PropTypes from 'prop-types';
import { HashLink } from 'react-router-hash-link';
import handleChange from '../../../../utils/form/use-state/handleChange';
import getMonthNowBr from '../../../../utils/dates/getMonthNowBr';

FilterAndButtons.propTypes = {
    setCurrComponent: PropTypes.func,
}

export default function FilterAndButtons({ setCurrComponent, setFilterData, filterData }) {
    const [selectedDate, handleDateChange] = useState(new Date());

    const styles = {
        form: {
            background: 'var(--mainDark)',
            borderRadius: '10px',
            padding: '25px'
        },
        fieldForm: {
            textAlign:'center',
            fontSize: '1.5em',
            backgroundColor: "var(--mainWhite)",
        },
        icon: {
            top: '-25px', left: '-25px', transform: 'rotate(20deg)'
        }
    }

    useEffect(() => {
        const date = new Date(selectedDate);
        const day = date.getDate();
        const month = getMonthNowBr(selectedDate);
        const year = date.getFullYear();

        let dateToSend;
        switch(filterData.period) {
            case 'day':
                dateToSend = `${day} de ${month} de ${year}`;
                break;
            case 'month':
                dateToSend = `${month} de ${year}`;
                break;
            default:
                dateToSend = "";
        }

        setFilterData({...filterData, chosenDate: dateToSend, selectedDate: date})

    }, [selectedDate, filterData.period])

    const showNewIncomeBtn = () => (
        <div>
            <HashLink
                smooth to="/admin/painel-de-controle/#nova-entrada"
                className="text-decoration-none"
            >
                <BigActionButton
                    title="NOVA ENTRADA"
                    fontAwesomeIcon="fas fa-arrow-up"
                    backgroundColor="var(--incomeGreen)"
                    backColorOnHover="var(--mainGreen)"
                    backColorOnKey="var(--mainGreen)"
                    onClick={() => setCurrComponent("NewIncome")}
                />
            </HashLink>
        </div>
    );

    const showNewExpenseBtn = () => (
        <div>
            <HashLink
                smooth to="/admin/painel-de-controle/#nova-saida"
                className="text-decoration-none"
            >
                <BigActionButton
                    title="NOVA SAÍDA"
                    fontAwesomeIcon="fas fa-arrow-down"
                    backgroundColor="var(--expenseRed)"
                    backColorOnHover="var(--mainRed)"
                    backColorOnKey="var(--mainRed)"
                    onClick={() => setCurrComponent("NewExpense")}
                />
            </HashLink>
        </div>
    );

    const displayDynamicField = period => (
        period !== "all" &&
        <span className="text-white text-normal text-em-1 font-weight-bold">
            {period === "day" ? "DIA:" : "MÊS:"}
            <br />
            <MuiPickersUtilsProvider utils={MomentUtils} locale={"pt-br"}>
                <DatePicker
                    variant="outlined"
                    inputProps={{
                        style: styles.fieldForm
                    }}
                    fullWidth
                    margin="dense"
                    okLabel={period === "day" ? "Selecionar" : ""}
                    cancelLabel={period === "day" ? "Voltar" : ""}
                    animateYearScrolling={true}
                    disableToolbar={true}
                    autoOk={period === "day" ? false : true}
                    views={period === "day" ? ["date"] : ["month", "year"]}
                    openTo={`${period === "day" ? "date" : "month"}`}
                    name={`${period === "day" ? "dayMonth" : "MonthYear"}`}
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </MuiPickersUtilsProvider>
        </span>
    );

    const showFilter = () => (
        <form style={styles.form} className="position-relative">
            <div style={styles.icon} className="position-absolute">
                <img src={`${CLIENT_URL}/img/icons/finance-funnel.svg`} width={100} height="auto" alt="funil finanças"/>
            </div>
            <p
                className="mb-2 text-white text-main-container text-center text-em-2 font-weight-bold">
                FILTRO
            </p>
            <span className="text-white text-normal text-em-1 font-weight-bold">
                PERÍODO SELECIONADO:
                <Select
                  style={styles.fieldForm}
                  fullWidth
                  variant="outlined"
                  name="period"
                  value={filterData.period}
                  onChange={handleChange(setFilterData, filterData)}
                >
                    <MenuItem value={'day'}>
                      POR DIA
                    </MenuItem>
                    <MenuItem value={'month'}>POR MÊS</MenuItem>
                    <MenuItem value={'all'}>TODOS</MenuItem>
                </Select>
            </span>
            <div className="mt-3">
                {displayDynamicField(filterData.period)}
            </div>
        </form>
    );

    return (
        <div className="row my-3 d-flex justify-content-between">
            <div className="col-12 col-md-4">
                {showFilter()}
            </div>
            <div className="col-6 col-md-4 mt-4">
                {showNewIncomeBtn()}
            </div>
            <div className="col-6 col-md-4 mt-4">
                {showNewExpenseBtn()}
            </div>
        </div>
    );
}