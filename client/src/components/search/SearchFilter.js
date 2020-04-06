import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';

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

  return (
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        name="searchTerm"
        autoComplete="off"
        className={classes.input}
        onBlur={searchChange}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder, style: { fontSize: '1.3em'} }}
      />
      <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={null} // Recommended to replace onBlur to this in next updates.
       >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
