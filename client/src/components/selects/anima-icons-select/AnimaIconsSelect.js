// reference: https://codepen.io/himalayasingh/pen/pxKKgd
import React, { useState, useEffect, useRef } from 'react';
import './AnimaIconsSelect.scss';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import handleChange from '../../../utils/form/use-state/handleChange';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const getStyles = () => ({
    root: { width: 300 },
    currIcon: {
        top: 3,
        transform: 'scale(1.8)',
        zIndex: 11,
        left: 0,
        color: 'var(--themeP)',
    },
    reverseBtn: {
        top: -35,
        left: '75%',
        transform: 'translateX(-75%)',
        zIndex: 14,
    }
});

export default function AnimaIconsSelect({
    callback,
}) {
    const [panel, setPanel] = useState(false);
    const [data, setData] = useState({
        selected: "Clientes Novos",
        selectedOptionBr: "Clientes Novos",
        reverseOptionBr: "Clientes Veteranos",
        CurrIcon: <StarsIcon />,
        title: "newCustomers",
        reverse: "veteranCustomers",
    });

    const toggleReverse = useRef(false);

    const {
        selected,
        selectedOptionBr,
        reverseOptionBr,
        CurrIcon,
        title,
        reverse,
    } = data;

    useEffect(() => {
        const foundElem = optionsArray.find(opt => opt.titleBr === selected);
        if(foundElem) {
            const {
                Icon, title, reverse, titleBr, reverseBr
            } = foundElem;
            setData({
                ...data,
                selected: titleBr,
                selectedOptionBr: titleBr,
                reverseOptionBr: reverseBr,
                title,
                reverse,
                CurrIcon: Icon,
            })
        }
    }, [selected])

    useEffect(() => {
        if(typeof callback === "function") {
            callback({ selected: title });
        }
    }, [selected, title]);

    const styles = getStyles();

    const togglePanel = () => {
        setPanel(prev => !prev);
    }

    const showFieldSelector = () => (
        <section
            id="anima-icons-select-button"
            className="anima-icons-border"
        >
            <div>
                <span id="selected-value" className="text-purple text-small font-weight-bold">
                    {selected}
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
                        name="selected"
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    <input
                        className="s-c bottom"
                        type="radio"
                        name="selected"
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    {opt.Icon}
                    <span className="label text-small font-weight-bold">{opt.titleBr}</span>
                    <span className="opt-val text-small font-weight-bold">{opt.titleBr}</span>
                </div>
            ))}
            <div id="option-bg"></div>
        </section>
    );

    const handleReverse = () => {
        // LESSON: .current should not be destructed or assigned to variable, otherwise it won't work.
        if(!toggleReverse.current) {
            setData({ ...data, selected: reverseOptionBr, title: reverse, })
            toggleReverse.current = true;
        } else {
            setData({ ...data, selected: selectedOptionBr, title: title, })
            toggleReverse.current = false;
        }
    }

    return (
        <section className="container-center-max-width-500">
            <section className="position-relative" style={styles.root}>
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
                <div style={styles.currIcon} className="position-absolute">
                    {CurrIcon}
                </div>
                <div style={styles.reverseBtn} className="position-absolute">
                    <ButtonFab
                       size="small"
                       position="relative"
                       iconFontAwesome={<FontAwesomeIcon icon="sync-alt" />}
                       onClick={handleReverse}
                       backgroundColor={"var(--themeSDark--default)"}
                    />
                </div>
            </section>
        </section>
    );
}


