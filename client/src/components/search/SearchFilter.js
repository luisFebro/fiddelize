import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { handleEnterPress } from '../../utils/event/isKeyPressed';

SearchFilter.propTypes = {
    placeholder: PropTypes.string,
    searchChange: PropTypes.func,
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: 'auto',
    maxWidth: 500,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  }
}));

export default function SearchFilter({ placeholder, searchChange }) {
  const classes = useStyles();

  const handleEnter = e => handleEnterPress(e, searchChange)

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        name="searchTerm"
        autoComplete="off"
        className={classes.input}
        onBlur={searchChange}
        onKeyPress={handleEnter}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder, style: { fontSize: '1.3em'} }}
      />
      <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={null}
       >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}


/*
<IconButton className={classes.iconButton} aria-label="menu">
  <MenuIcon />
</IconButton>
 */