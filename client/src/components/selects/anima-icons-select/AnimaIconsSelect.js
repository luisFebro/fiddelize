// reference: https://codepen.io/himalayasingh/pen/pxKKgd
import React, { useState } from 'react';
import './AnimaIconsSelect.scss';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import handleChange from '../../../utils/form/use-state/handleChange';

// custom icons
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import CakeIcon from '@material-ui/icons/Cake';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import StarsIcon from '@material-ui/icons/Stars';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import LocalMallIcon from '@material-ui/icons/LocalMall';

// show a yellow badge for premium options aside the name.
const optionsArray = [
    {
        titleBr: "Ordem Alfabética A-Z",
        title: "alphabeticOrder",
        reverseBr: "Ordem Alfabética Z-A",
        reverse: "alphabeticOrderZA",
        removeEmptyOpt: false,
        isPremium: false,
        Icon: <SortByAlphaIcon />,
    },
    {
        titleBr: "Clientes Aniversariantes",
        title: "birthdayCustomers",
        reverseBr: null,
        reverse: null,
        removeEmptyOpt: false,
        isPremium: true,
        Icon: <CakeIcon />,
    },
    {
        titleBr: "Clientes Compram Mais",
        title: "buyMoreCustomers",
        reverseBr: "Clientes Compram Menos",
        reverse: "buyLessCustomers",
        removeEmptyOpt: true,
        isPremium: true,
        Icon: <LoyaltyIcon />,
    },
    {
        titleBr: "Clientes Novos",
        title: "newCustomers",
        reverseBr: "Clientes Veteranos",
        reverse: "veteranCustomers",
        removeEmptyOpt: false,
        isPremium: false,
        Icon: <StarsIcon />,
    },
    {
        titleBr: "Maiores Pontos Gerais",
        title: "highestScores",
        reverseBr: "Menores Pontos Gerais",
        reverse: "lowestScores",
        removeEmptyOpt: true,
        isPremium: true,
        Icon: <FiberManualRecordIcon />,
    },
    {
        titleBr: "Maiores Valores por Compra",
        title: "highestSinglePurchases",
        reverseBr: "Menores Valores por Compra",
        reverse: "lowestSinglePurchases",
        removeEmptyOpt: true,
        isPremium: true,
        Icon: <MonetizationOnIcon />,
    },
    {
        titleBr: "Últimas Compras",
        title: "lastPurchases",
        reverseBr: "Primeiras Compras",
        reverse: "firstPurchases",
        removeEmptyOpt: true,
        isPremium: true,
        Icon: <LocalMallIcon />,
    },
]
export default function AnimaIconsSelect() {
    const [panel, setPanel] = useState(false);
    const [data, setData] = useState({
        selectedOptionBr: "Clientes Novos",
    });
    const { selectedOptionBr } = data;
    console.log("selectedOption", selectedOptionBr);

    const togglePanel = () => {
        setPanel(prev => !prev);
    }

    const showFieldSelector = () => (
        <section
            id="anima-icons-select-button"
            className="anima-icons-border"
        >
            <div id="selected-value">
                <span className="text-purple text-small font-weight-bold">
                    {selectedOptionBr}
                </span>
            </div>
            <div id="chevrons">
                <KeyboardArrowUpIcon />
                <KeyboardArrowDownIcon />
            </div>
        </section>
    );

    const showPanelOptions = (optionsArray) => (
        <section className={`${panel ? "d-block animated fadeIn" : "d-none"}`} id="options">
            {optionsArray.map(opt => (
                <div onClick={null} key={opt.title} className="option">
                    <input
                        className="s-c top"
                        type="radio"
                        name="selectedOptionBr"
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    <input
                        className="s-c bottom"
                        type="radio"
                        name="selectedOptionBr"
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    {opt.Icon}
                    <span className="label">{opt.titleBr}</span>
                    <span className="opt-val">{opt.titleBr}</span>
                </div>
            ))}
            <div id="option-bg"></div>
        </section>
    );

    return (
        <form id="app-cover">
            <section id="select-box">
                <input
                    onClick={togglePanel}
                    type="checkbox"
                    id="options-view-button"
                />
                {showFieldSelector()}
                {showPanelOptions(optionsArray)}
            </section>
        </form>
    );
}


