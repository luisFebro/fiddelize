// reference: https://material-ui.com/components/autocomplete/
import { useState, useEffect, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getVar, { setVar } from "init/var";
import isKeyPressed from "utils/event/isKeyPressed";
import useData from "init";
import useToken, { chooseHeader } from "auth/useToken";
import disconnect from "auth/disconnect";
// 1. Allow enter key to select the first result and filter it after that.
// Ideally, this first result needs to be highlighted.
const truncate = (name, leng) => window.Helper.truncate(name, leng);

const getStyles = ({ fieldBack, themeColor, txtFont, formWidth }) => ({
    asyncAutoSearch: {
        backgroundColor: fieldBack,
        color: themeColor,
        fontSize: txtFont,
        fontFamily: "var(--mainFont)",
    },
    icon: {
        color: themeColor,
        transform: "scale(1.4)",
    },
    loadingIcon: {
        color: themeColor,
    },
    autocomplete: {
        width: formWidth,
    },
});

function highlightSearchResult(string, search) {
    const reg = new RegExp(search, "gi");
    let newString = string.replace(
        reg,
        `<span class="theme-back--default d-inline-block font-site text-white">${search}</span>`
    );
    newString = parse(newString.toLowerCase());
    return newString;
}

function handlePickedValuesHistory(pickedValue, options = {}) {
    const { offlineKey, maxHistory } = options;

    if (!offlineKey) return;

    getVar(offlineKey).then((data) => {
        if (data) {
            const dataArray = [pickedValue, ...data].filter(Boolean);
            const newValue = [...new Set(dataArray)]; // to avoid the array to turn into <object data="" type=""></object>

            if (data.length >= maxHistory) {
                data.pop();
                setVar({ [offlineKey]: newValue });
            } else {
                setVar({ [offlineKey]: newValue });
            }
        } else {
            setVar({ [offlineKey]: [pickedValue] });
        }
    });
}

// future: find a way to show suggestions for a query not matched with it, but have a list of data related to it like when user search for a category and a list of items from that category is shown up.
export default function AutoCompleteSearch({
    autocompleteUrl,
    setData,
    noOptionsText = "",
    timeout = 5000,
    fieldBack = "#fff",
    themeColor = "var(--themeP)",
    txtFont = "1.2em",
    clearOnEscape = true,
    clearOnBlur = true,
    selectOnFocus = true,
    autoSelect = false,
    openOnFocus = true,
    freeSolo = false,
    placeholder = "Procure alguma coisa...",
    // formWidth = "100%",
    needArrowEndAdornment = false,
    needAuth = true,
    autoHighlight = true,
    offlineKey = "",
    maxHistory = 4,
    autoFocus = false,
    ignoreEmptyHist = true,
    disable,
    searchIcon = undefined, // fa icon name
    inputId = undefined, // id for working with focus
    showImgs = false,
    clearField, // clear field programmaticaly
}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [newSearchUrl, setNewSearchUrl] = useState(autocompleteUrl);
    const [searchChange, setSearchChange] = useState("");
    const [loading, setLoading] = useState(false);
    const [needHistory, setNeedHistory] = useState(true);
    const [imgList, setImgList] = useState(null);

    const didUserStartTyping = Boolean(searchChange.length);

    const token = useToken();
    const { firstName: name } = useData();

    const styles = getStyles({ fieldBack, themeColor, txtFont });

    const onSelectedValue = (pickedValue) => {
        setData((data) => ({
            ...data,
            selectedValue: pickedValue || "_cleared",
        }));
        handlePickedValuesHistory(pickedValue, { offlineKey, maxHistory });

        // clear the field right away when selected item
        if (clearField) {
            setSearchChange("");
        }
    };

    const onSearchChange = (e) => {
        const currValue = e.target.value;
        setSearchChange(currValue);
    };

    // Select the first suggested item from the list
    const onKeyPress = (e) => {
        if (isKeyPressed(e, "Enter")) {
            if (options) {
                const selectFirst = options[0];
                onSelectedValue(selectFirst);
            }
        }
    };

    const getValuesHistory = () => {
        getVar(offlineKey).then((data) => {
            if (data) {
                setNeedHistory(true);
                setOptions(data);
                return;
            }

            if (!ignoreEmptyHist) setOptions([" "]);
        });
    };

    useEffect(() => {
        if (searchChange)
            setNewSearchUrl(`${autocompleteUrl}&search=${searchChange}`);
    }, [searchChange]);

    useEffect(() => {
        let active = true;
        let cancel;

        setNeedHistory(true);

        const stopRequest = setTimeout(() => {
            cancel();
            setLoading(false);
        }, timeout);

        if (open) setLoading(true);

        const config = {
            url: newSearchUrl,
            method: "get",
            headers: chooseHeader({ token, needAuth }),
            cancelToken: new axios.CancelToken((c) => {
                cancel = c;
            }),
        };

        if (!didUserStartTyping) return;

        async function doRequest() {
            try {
                const response = await axios(config);

                clearTimeout(stopRequest);
                setNeedHistory(false);

                const responseData = showImgs
                    ? response.data
                    : Array.isArray(response.data);

                if (active && responseData) {
                    let targetData = response.data;
                    if (showImgs) {
                        targetData = targetData && targetData.names;
                        if (targetData && !targetData.length) {
                            setOptions(targetData);
                            return setLoading(false);
                        }

                        const thisImgs = response.data && response.data.imgs;
                        const imgsData = targetData.map((thisName, ind) => ({
                            id: thisName,
                            img: thisImgs[ind],
                        }));
                        setImgList(imgsData);
                    }

                    if (targetData.length === 0) {
                        getValuesHistory();
                    } else {
                        if (didUserStartTyping) setOptions(targetData);
                    }
                }

                setLoading(false);
            } catch (e) {
                if (axios.isCancel(e)) return;
                const res = e.response && e.response.status;
                if (res === 403 || res === 401) {
                    (async () => {
                        await disconnect();
                    })();
                }
                if (e.response) {
                    console.log(
                        `${JSON.stringify(e.response.data)}. STATUS: ${
                            e.response.status
                        }`
                    );

                    const status = e.response && e.response.status;
                    setLoading(false);
                }
            }
        }

        doRequest();

        return () => {
            cancel();
            clearTimeout(stopRequest);
            active = false;
        };
    }, [newSearchUrl]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
        if (needHistory || searchChange.length === 0) {
            getValuesHistory();
        }
    }, [open, needHistory, searchChange]);

    return (
        <Autocomplete
            id="asynchronous-demo"
            style={styles.autocomplete}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={(event, value) => onSelectedValue(value)}
            getOptionSelected={(option, value) =>
                option.toLowerCase() === value.toLowerCase()
            }
            getOptionLabel={(option) => option}
            options={options}
            loading={loading}
            loadingText="Carregando..."
            clearText="Limpar"
            closeText="Fechar"
            noOptionsText={
                didUserStartTyping
                    ? name
                        ? `${noOptionsText}, ${name}`
                        : `${noOptionsText}`
                    : name
                    ? `${name}, no aguardo da sua busca!`
                    : "No aguardo da sua busca!"
            }
            autoHighlight={autoHighlight}
            includeInputInList
            freeSolo={freeSolo}
            clearOnEscape={clearOnEscape}
            clearOnBlur={clearOnBlur}
            selectOnFocus={selectOnFocus}
            autoSelect={autoSelect}
            autoComplete
            openOnFocus={openOnFocus}
            renderOption={(option) => {
                const ultimateQuery = truncate(option, 40);
                const showImg = () => {
                    const foundImg = imgList.find((img) => img.id === option);
                    const ultimateImg = foundImg && foundImg.img;

                    return (
                        <Fragment>
                            {showImgs && (
                                <div className="d-inline-block ml-3">
                                    <img
                                        width={70}
                                        height={70}
                                        src={ultimateImg || "/img/error.png"}
                                        alt="foto item"
                                    />
                                </div>
                            )}
                        </Fragment>
                    );
                };

                return (
                    <div className="text-em-1-4 font-site">
                        {needHistory ? (
                            <FontAwesomeIcon
                                icon="history"
                                className="text-light-purple"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon="search"
                                className="text-light-purple"
                            />
                        )}{" "}
                        {searchChange
                            ? highlightSearchResult(ultimateQuery, searchChange)
                            : ultimateQuery}
                        {showImgs && showImg()}
                    </div>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={styles.asyncAutoSearch}
                    placeholder={placeholder}
                    fullWidth
                    autoFocus={autoFocus}
                    onChange={onSearchChange}
                    onKeyPress={(e) => onKeyPress(e)}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        id: inputId,
                        type: "search",
                        style: {
                            fontSize: txtFont,
                            color: themeColor,
                            paddingRight: "10px",
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                {searchIcon ? (
                                    <FontAwesomeIcon
                                        icon={searchIcon}
                                        style={{
                                            ...styles.icon,
                                            transform: "scale(0.9)",
                                        }}
                                    />
                                ) : (
                                    <SearchIcon style={styles.icon} />
                                )}
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <Fragment>
                                {loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={35}
                                    />
                                ) : null}
                                {needArrowEndAdornment
                                    ? params.InputProps.endAdornment
                                    : null}
                            </Fragment>
                        ),
                    }}
                />
            )}
            value={searchChange}
        />
    );
}

/* ARCHIVES
function sleep(delay = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}
*/
