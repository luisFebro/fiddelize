// reference: https://codepen.io/himalayasingh/pen/pxKKgd
import React, { useState, useEffect, useRef } from "react";
import "./_AnimaIconsSelect.scss";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import handleChange from "../../../utils/form/use-state/handleChange";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePro from "../../../hooks/pro/usePro";
import { useOfflineData } from "../../../hooks/storage/useOfflineListData";
import CheckboxBoxForm from "../../../components/CheckBoxForm";
import gotArrayThisItem from "../../../utils/arrays/gotArrayThisItem";

const getStyles = () => ({
    root: { width: 300 },
    currIcon: {
        top: 3,
        transform: "scale(1.8)",
        zIndex: 11,
        left: 0,
        color: "var(--themeP) !important",
    },
    reverseBtn: {
        bottom: -5,
        left: "90%",
        transform: "translateX(-90%)",
        zIndex: 14,
    },
    checkIcon: {
        fontSize: "15px",
        marginLeft: "10px",
        color: "var(--themeP)",
    },
    proBadge: {
        top: 0,
        right: 10,
        borderRadius: "20px",
        padding: "3px 5px",
        background: "var(--niceUiYellow)",
    },
});

const handleTrigger = (dataArray, selected) => {
    const reverseBrOnlyOptions = dataArray().map((rev) => rev.reverseBr);
    const needSkipReverse = gotArrayThisItem(reverseBrOnlyOptions, selected);

    if (needSkipReverse) return false;
    return !selected ? true : selected; // update at launch to fetch any offline data there is. Else update in every selected changing
};

const handleNeedEmptyOption = (dataArray, selected) => {
    const emptyOptions = [];
    dataArray().forEach((emp) => {
        if (emp.showEmptyOption === true) {
            emptyOptions.push(emp.reverseBr);
        }
    });

    const needEmptyOpt = gotArrayThisItem(emptyOptions, selected);
    return needEmptyOpt;
};

export default function AnimaIconsSelect({
    optionsArray,
    defaultSideIcon,
    offlineKey,
    callback,
    loading = false,
}) {
    const [panel, setPanel] = useState(false);
    const [status, setStatus] = useState("Organizado!");
    const [data, setData] = useState({
        selected: "",
        selectedOptionBr: "Clientes Novos",
        reverseOptionBr: "Clientes Veteranos",
        CurrIcon: defaultSideIcon,
        title: "newCustomers",
        reverse: "veteranCustomers",
        isReversed: undefined,
    });
    const {
        selected,
        selectedOptionBr,
        reverseOptionBr,
        CurrIcon,
        title,
        reverse,
        isReversed,
    } = data;

    const styles = getStyles();

    const needEmptyOpt = handleNeedEmptyOption(optionsArray, selected);
    const needTriggerOffData = handleTrigger(optionsArray, selected);
    const { offlineData, loading: loadingOffline } = useOfflineData({
        dataName: offlineKey,
        data: selected,
        trigger: needTriggerOffData,
    });

    const { isUserPro } = usePro({ feature: "orgganize_clients" });

    const toggleReverse = useRef(false);

    const alreadyOffline = useRef(false);
    useEffect(() => {
        let thisSelected;

        if (!alreadyOffline.current && !loadingOffline) {
            thisSelected = !offlineData ? "Clientes Novos" : offlineData;
            alreadyOffline.current = true;
        } else {
            thisSelected = selected;
        }

        const foundElem = optionsArray(isUserPro).find(
            (opt) => opt.titleBr === thisSelected
        );
        if (foundElem && alreadyOffline.current) {
            const { Icon, title, reverse, titleBr, reverseBr } = foundElem;
            setData({
                ...data,
                selected: titleBr,
                selectedOptionBr: titleBr,
                reverseOptionBr: reverseBr,
                title,
                reverse,
                CurrIcon: Icon,
            });
        }
    }, [selected, offlineData, alreadyOffline.current, loadingOffline]);

    useEffect(() => {
        if (typeof callback === "function") {
            callback({ selected: title, isReversed: false, needEmpty: false });
        }
    }, [selected, title]);

    const handleShowEmptyCards = (isChecked) => {
        if (typeof callback === "function") {
            callback({
                selected: title,
                isReversed: false,
                needEmpty: isChecked,
            });
        }
    };

    useEffect(() => {
        const handleStatus = () => {
            if (loading) {
                return isReversed ? "invertendo ordem..." : "organizando...";
            } else {
                return "Organizado!";
            }
        };

        const thisTitle = handleStatus();
        setStatus(thisTitle);
    }, [loading, isReversed]);

    const togglePanel = () => {
        setPanel((prev) => !prev);
    };

    const showFieldSelector = () => (
        <section id="anima-icons-select-button" className="anima-icons-border">
            <div>
                <span
                    id="selected-value"
                    className="text-purple text-small font-weight-bold"
                >
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
        <section
            className={`${panel ? "d-block animated fadeIn" : "d-none"}`}
            id="options"
        >
            {optionsArray(isUserPro).map((opt) => (
                <div
                    key={opt.title}
                    className={`option ${
                        isUserPro || !opt.isPro ? "" : "disabled-link"
                    }`}
                >
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
                        disabled={opt.pro ? true : false}
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    {opt.Icon}
                    <span
                        style={{
                            color: isUserPro || !opt.isPro ? undefined : "grey",
                        }}
                        className="label text-small font-weight-bold"
                    >
                        {opt.titleBr}
                    </span>
                    <span className="opt-val text-small font-weight-bold">
                        {opt.titleBr}
                    </span>
                    {!isUserPro && opt.isPro && (
                        <div
                            className="position-absolute ml-3 font-weight-bold text-small text-black"
                            style={styles.proBadge}
                        >
                            pro
                        </div>
                    )}
                </div>
            ))}
            <div id="option-bg"></div>
        </section>
    );

    const handleReverse = () => {
        // LESSON: .current should not be destructed or assigned to variable, otherwise it won't work.
        if (!toggleReverse.current) {
            setData({
                ...data,
                selected: reverseOptionBr,
                title: reverse,
                isReversed: true,
            });
            toggleReverse.current = true;
        } else {
            setData({
                ...data,
                selected: selectedOptionBr,
                title: title,
                isReversed: false,
            });
            toggleReverse.current = false;
        }
    };

    const showStatus = () => {
        const needCheckIcon =
            status === "Organizado e invertido!" || status === "Organizado!";
        return (
            <p className="mt-1 text-purple text-small font-weight-bold">
                {status}
                {needCheckIcon && (
                    <FontAwesomeIcon
                        className="animated rubberband repeat-2"
                        icon="check-circle"
                        style={styles.checkIcon}
                    />
                )}
            </p>
        );
    };

    return (
        <section className="container-center-max-width-500">
            <section className="position-relative" style={styles.root}>
                <form id="app-cover" onChange={togglePanel}>
                    <section id="select-box">
                        <input
                            type="checkbox"
                            id="options-view-button"
                            checked
                        />
                        {showFieldSelector()}
                        {showPanelOptions(optionsArray)}
                    </section>
                </form>
                {showStatus()}
                <div style={styles.currIcon} className="position-absolute">
                    {CurrIcon}
                </div>
                {!panel && title !== "birthdayCustomers" && (
                    <div
                        style={styles.reverseBtn}
                        className="position-absolute"
                    >
                        <ButtonFab
                            size="small"
                            position="relative"
                            iconFontAwesome={
                                <FontAwesomeIcon icon="sync-alt" />
                            }
                            onClick={handleReverse}
                            backgroundColor={"var(--themeSDark--default)"}
                        />
                    </div>
                )}
                {needEmptyOpt && (
                    <CheckboxBoxForm
                        text="mostrar resultados vazios."
                        callback={handleShowEmptyCards}
                        position="position-absolute"
                    />
                )}
            </section>
            <div
                className={panel ? "anima-icons-overlay" : ""}
                onClick={togglePanel}
            ></div>
        </section>
    );
}
