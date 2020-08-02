/*
required to update material ui to the latest stable version: 4.11 in order to use TableContainer.import
In case of failing or something unusual, the last working version was ^4.7.2
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import ButtonFab from '../buttons/material-ui/ButtonFab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    font: 'bolder 18px var(--mainFont)',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 300,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

// DATA
const rows = [
  { name: "Ana Beatriz", contact: "(92) 99281-7355" },
  { name: "Beatriz Lima", contact: "(92) 99281-7353" },
  { name: "Carlos Eduardo", contact: "(92) 98281-7353" },
  { name: "Denis Lima", contact: "(92) 98281-7353" },
  { name: "Eduardo Augusto", contact: "(92) 98281-7354" },
  { name: "Fernando Luis", contact: "(92) 98281-7359" },
  { name: "Gustavo Oliveira", contact: "(92) 98281-7310" },
  { name: "Helen Rocha", contact: "(92) 95281-7310" },
  { name: "Igo Lins", contact: "(92) 95211-7310" },
  { name: "Jéssica Alburquerque", contact: "(92) 95211-7314" },
  { name: "Kelly Noronha", contact: "(92) 95219-7314" },
  { name: "Leonardo Oliveira", contact: "(92) 95219-7318" },
  { name: "Maria de Jesus", contact: "(92) 95219-7319" },
];
// END DATA

export default function MuSelectTable({
    callback
}) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState(rows.map((n) => n.name));
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        if(typeof callback === "function") callback(selected);
    }, [selected]);

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = () => {
      if(!selected.length) {
        const newSelecteds = rows.map((n) => n.name);
        setSelected(newSelecteds);
        return;
      } else {
          setSelected([]);
      }
    };

    const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <ShowTableMainTitle numSelected={selected.length} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={false ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <ShowTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                selected={selected}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.contact}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (false ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais do que ${to}`}`}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={null}
          />
        </Paper>
      </div>
    );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  mainTitle: {
    textAlign: 'center',
    font: 'bold 25px var(--mainFont)',
    color: 'var(--themeP)',
    flex: 1,
  },
}));

const ShowTableMainTitle = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.mainTitle} color="inherit" variant="subtitle1" component="div">
          {numSelected} selecionados
        </Typography>
      ) : (
        <Typography
            className={classes.mainTitle}
            variant="h6"
            id="tableTitle"
            component="div"
        >
          Lista de Clientes
        </Typography>
      )}
    </Toolbar>
  );
};

ShowTableMainTitle.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

ShowTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function ShowTableHead(props) {
  const { classes, onSelectAllClick, selected, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Nome Cliente' },
    { id: 'contact', numeric: false, disablePadding: true, label: 'Contato' },
  ];

  const showToggleCheckBtn = () => (
    <ButtonFab
        size="medium"
        title={Boolean(selected.length) ? "Desmarcar todos" : "Marcar Todos"}
        onClick={onSelectAllClick}
        backgroundColor={"var(--themeSDark--default)"}
        variant = 'extended'
        position = 'relative'
    />
  );

  return (
    <TableHead>
      {showToggleCheckBtn()}
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


