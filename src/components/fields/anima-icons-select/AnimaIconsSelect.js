// reference: https://codepen.io/himalayasingh/pen/pxKKgd
import { Fragment, useState, useEffect, useRef } from "react";
import "./_AnimaIconsSelect.scss";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import handleChange from "utils/form/use-state/handleChange";
import usePro from "hooks/pro/usePro";
import { useOfflineData } from "hooks/storage/useOfflineListData";
import gotArrayThisItem from "utils/arrays/gotArrayThisItem";
import ButtonFab from "../../buttons/material-ui/ButtonFab";

const getStyles = () => ({
    currIcon: {
        top: 5,
        transform: "scale(1.8)",
        zIndex: 11,
        left: 0,
        color: "var(--themeP) !important",
    },
    reverseBtn: {
        bottom: -30,
        left: "80%",
        transform: "translateX(-80%)",
        zIndex: 14,
    },
    proBadge: {
        top: 0,
        right: 10,
        borderRadius: "20px",
        padding: "3px 5px",
        background: "var(--niceUiYellow)",
    },
});

const handleTrigger = (dataArray, options = {}) => {
    const { selected, isPro } = options;

    const reverseBrOnlyOptions = dataArray(isPro).map((rev) => rev.reverseBr);
    const needSkipReverse = gotArrayThisItem(reverseBrOnlyOptions, selected);

    if (needSkipReverse) return false;
    return !selected ? true : selected; // update at launch to fetch any offline data there is. Else update in every selected changing
};

export default function AnimaIconsSelect({
    optionsArray,
    defaultSideIcon,
    defaultSelected = "Clientes Novos",
    offlineKey,
    callback,
    width,
    needReverseBtn = true,
    zIndex,
    checkServicePro,
}) {
    const [panel, setPanel] = useState(false);
    const [data, setData] = useState({
        selected: "",
        selectedOptionBr: "",
        reverseOptionBr: "",
        CurrIcon: defaultSideIcon,
        title: "",
        reverse: "",
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

    const { isPro } = usePro({
        feature: checkServicePro,
        trigger: checkServicePro,
    });

    const styles = getStyles();

    const needTriggerOffData = handleTrigger(optionsArray, {
        selected,
        isPro,
    });
    const { offlineData, loading: loadingOffline } = useOfflineData({
        dataName: offlineKey,
        data: selected,
        trigger: offlineKey && needTriggerOffData,
    });

    const toggleReverse = useRef(false);

    const alreadyOffline = useRef(false);

    // allowing results when disabling offline feature:
    const alreadyDefault = useRef(false);
    useEffect(() => {
        if (!offlineKey) {
            const foundElem = optionsArray().find((opt) => {
                const cond = !alreadyDefault.current
                    ? opt.titleBr === defaultSelected
                    : opt.titleBr === selected;

                return cond;
            });

            if (foundElem) {
                alreadyDefault.current = true;
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
        }
    }, [offlineKey, selected, alreadyDefault.current]);

    useEffect(() => {
        let thisSelected;

        if (!offlineKey) return;

        if (!alreadyOffline.current && !loadingOffline) {
            thisSelected = !offlineData ? defaultSelected : offlineData;
            alreadyOffline.current = true;
        } else {
            thisSelected = selected;
        }

        const foundElem = optionsArray(isPro).find(
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
            callback({ selected: title, isReversed: false, needEmpty: true });
        }
    }, [selected, title]);

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
            {optionsArray(isPro).map((opt) => (
                <div
                    key={opt.title}
                    className={`option ${
                        isPro || !opt.isPro ? "" : "disabled-link"
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
                        disabled={!!opt.pro}
                        value={opt.titleBr}
                        onChange={handleChange(setData)}
                    />
                    {opt.Icon}
                    <span
                        style={{
                            color: isPro || !opt.isPro ? undefined : "grey",
                        }}
                        className="label text-small font-weight-bold"
                    >
                        {opt.titleBr}
                    </span>
                    <span className="opt-val text-small font-weight-bold">
                        {opt.titleBr}
                    </span>
                    {!isPro && opt.isPro && (
                        <div
                            className="position-absolute ml-3 font-weight-bold text-small text-black"
                            style={styles.proBadge}
                        >
                            pro
                        </div>
                    )}
                </div>
            ))}
            <div id="option-bg" />
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
                title,
                isReversed: false,
            });
            toggleReverse.current = false;
        }
    };

    const showReverseBtn = () => (
        <Fragment>
            {needReverseBtn && !panel && title !== "birthdayCustomers" && (
                <div style={styles.reverseBtn} className="position-absolute">
                    <ButtonFab
                        size="small"
                        iconFontSize="20px"
                        position="relative"
                        iconFontAwesome={
                            <FontAwesomeIcon
                                icon={
                                    isReversed
                                        ? "sort-amount-down-alt"
                                        : "sort-amount-down"
                                }
                            />
                        }
                        onClick={handleReverse}
                        backgroundColor="var(--themeSDark--default)"
                    />
                </div>
            )}
        </Fragment>
    );

    const styleMainIcon = {
        ...styles.currIcon,
        zIndex: zIndex || 11,
    };

    return (
        <section className="d-flex justify-content-start">
            <section className="position-relative">
                <form
                    id="app-cover"
                    onChange={togglePanel}
                    style={{
                        width: width || 300,
                        zIndex: zIndex || 5,
                    }}
                >
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
                <div style={styleMainIcon} className="position-absolute">
                    {CurrIcon}
                </div>
                {showReverseBtn()}
            </section>
            <div
                className={panel ? "anima-icons-overlay" : ""}
                onClick={togglePanel}
            />
        </section>
    );
}
