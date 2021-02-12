// reference: https://material-ui.com/components/autocomplete/
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getHeaderJson } from '../../../utils/server/getHeaders';
import parse from 'html-react-parser';


// IMPROVEMENTS:
// 1. Allow enter key to select the first result and filter it after that.
// Ideally, this first result needs to be highlighted.
// 2. User history results
// 3. Implement vanilla DEBOUNCE (rebater) solution to avoid the XHR request to be fetched too often>
AsyncAutoCompleteSearch.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string),
    circularProgressColor: PropTypes.oneOf(["inherit", "primary", "secondary"])
}

function sleep(delay = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

export default function AsyncAutoCompleteSearch({
    url,
    autoCompleteUrlStr,
    circularProgressColor,
    onAutoSelectChange,
    onValueChange,
    noOptionsText,
    backgroundColor,
    color,
    fontSize,
    clearOnEscape = false,
    needUserValueFunc = false,
    freeSolo = false,
    disableOpenOnFocus = false,
    placeholder,
    formWidth }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [autoCompleteUrl, setAutoCompleteUrl] = useState(url);
    const [userValue, setUserValue] = useState("");
    const loading = open && options.length === 0;

    const onUserValueChange = e => {
        const changedValue = e.target.value;
        setUserValue(changedValue);
        onValueChange && onValueChange(changedValue);
        setAutoCompleteUrl(autoCompleteUrlStr || `/api/finance/cash-ops/list/all?search=${changedValue}&autocomplete=true`)
    }

    React.useEffect(() => {
        let active = true;

        // if(!loading) {
        //     return undefined;
        // }

        (async () => {
            const response = await axios.get(autoCompleteUrl, getHeaderJson);
            await sleep(1e3); // For demo purposes.

            if(active && Array.isArray(response.data)) {
                if(response.data.length === 0) {
                    setOptions([" "])
                } else {
                    setOptions(response.data)
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, autoCompleteUrl]);

    React.useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open, userValue]);

    const styles = {
        asyncAutoSearch: {
            backgroundColor: backgroundColor || 'var(--mainWhite)',
            color: color || 'black',
            fontSize: fontSize || '1.4em',
            fontFamily: 'var(--mainFont)',
        },
        icon: {
            color: color || 'black',
            transform: 'scale(1.4)'
        },
        loadingIcon: {
            color: color || "var(--mainPink)",
        }
    }

    const highlightSearchResult = (string, search) => {
        const reg = new RegExp(search, 'gi');
        let newString = string.replace(reg, `<strong>${search}</strong>`);
        newString = parse(newString.toLowerCase());
        return newString;
    }

    return (
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: formWidth || 400 }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(event, value) => onAutoSelectChange(value)}
          getOptionSelected={(option, value) => option.toLowerCase() === value.toLowerCase()}
          getOptionLabel={option => option}
          options={options}
          loading={loading}
          loadingText="Carregando..."
          clearText="Limpar"
          closeText="Fechar"
          noOptionsText={noOptionsText}
          autoHighlight
          includeInputInList
          disableOpenOnFocus={disableOpenOnFocus}
          freeSolo={freeSolo}
          clearOnEscape={clearOnEscape}
          autoComplete
          renderOption={option => (
              <div className="text-em-1-4">
                <span><i style={{color: 'grey'}} className="fas fa-search"></i></span>{" "}
                {userValue ? highlightSearchResult(option, userValue) : option}
              </div>
          )}
          renderInput={params => (
            <TextField
              {...params}
              style={styles.asyncAutoSearch}
              placeholder={placeholder}
              fullWidth
              onChange={onUserValueChange}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                style: {
                    fontSize: '1em',
                },
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon style={styles.icon} />
                </InputAdornment>
            ),
            endAdornment: (
                <React.Fragment>
                    {loading ? <CircularProgress color={circularProgressColor || "inherit"} size={25} /> : null}
                    {params.InputProps.endAdornment}
                </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}