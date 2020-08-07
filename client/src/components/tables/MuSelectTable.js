/*
required to update material ui to the latest stable version: 4.11 in order to use TableContainer.import
In case of failing or something unusual, the last working version was ^4.7.2
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
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

const MyTableCell = withStyles({
    root: { color: 'var(--themeP) !important', font: 'bold 17px var(--mainFont)'},
    head: { color: '#fff !important', background: 'var(--themeP) !important' },
})(TableCell);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  colorCheckBox: {
    color: 'var(--themeP) !important'
  },
  paginationRoot: {
    marginBottom: '50px',
  },
  paginationCaption: {
    font: 'bold 17px var(--mainFont)',
    color: 'var(--themeP)',
  },
  sortLabelIcon: {
    color: '#fff !important',
    fontSize: '30px',
  },
  sortLabelActive: {
    color: '#fff !important',
  },
  tableCellStyle: {
    fontSize: '15px !important',
    padding: '16px 0',
  },
}));

export default function MuSelectTable({
    rowsData = [],
    emptySelection = false,
    callback,
}) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState(rowsData.map((n) => n.name));
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [colorHighlighted, setColorHighlighted] = React.useState(true);

    useEffect(() => {
        if(emptySelection) setSelected([]);
    }, [emptySelection])

    const getTableRowStyle = ({ colorHighlighted }) => ({
        root: { cursor: 'pointer', backgroundColor: colorHighlighted ? "rgb(124, 67, 189, 0.1) !important" : "#fff"}
    })
    const MyTableRow = withStyles(getTableRowStyle({ colorHighlighted }))(TableRow);

    const handleColorSelection = () => {
        setColorHighlighted(prev => !prev);
    }

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
        const newSelecteds = rowsData.map((n) => n.name);
        setSelected(newSelecteds);
        setColorHighlighted(true);
        return;
      } else {
          setSelected([]);
          setColorHighlighted(false);
      }
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const tableBodyProps = { handleColorSelection, MyTableRow, rowsData, order, orderBy, classes, page, rowsPerPage, setSelected, selected };
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <ShowTableMainTitle
            rowsData={rowsData}
            numSelected={selected.length}
            selected={selected}
            onSelectAllClick={handleSelectAllClick}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={false ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <ShowTableHead
                classes={classes}
                order={order}
                MyTableRow={MyTableRow}
                selected={selected}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <ShowTableBody {...tableBodyProps} />
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 50]}
            nextIconButtonProps={{
                style: { width: '30px' },
            }}
            classes={{
                root: classes.paginationRoot,
                caption: classes.paginationCaption,
                input: classes.paginationCaption,
            }}
            component="div"
            labelRowsPerPage=""
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais do que ${to}`}`}
            count={rowsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={null}
          />
        </Paper>
      </div>
    );
}

const useMainTitle = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        justifyContent: "center",
        flexFlow: "column wrap"
    },
    mainTitle: {
        textAlign: 'center',
        font: 'bold 25px var(--mainFont)',
        color: 'var(--themeP)',
        flex: 1,
    },
}));

const ShowTableMainTitle = ({ rowsData, listName= "", numSelected, selected, onSelectAllClick }) => {
  const classes = useMainTitle();

  const showToggleCheckBtn = () => (
    Boolean(rowsData && rowsData.length) &&
    <section className="my-3" >
        <ButtonFab
            size="medium"
            width="230px"
            needTxtNoWrap={true}
            title={Boolean(selected.length) ? "Desmarcar todos" : "Marcar Todos"}
            onClick={onSelectAllClick}
            backgroundColor={"var(--themeSDark--default)"}
            variant = 'extended'
            position = 'relative'
        />
    </section>
  );

  return (
    <Toolbar
      className={classes.root}
    >
        <Typography
            className={classes.mainTitle}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            {listName}
        </Typography>
        {showToggleCheckBtn()}
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
  const { MyTableRow, classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Nome Cliente' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Contato' },
  ];

  return (
    <TableHead>
      <MyTableRow>
        <MyTableCell padding="checkbox" style={{ fontSize: "15px !important" }}>
          <Checkbox
            indeterminate={null}
            checked={null}
            onChange={null}
            style={{ display: 'none' }}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </MyTableCell>
        {headCells.map((headCell) => (
          <MyTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
                classes={{
                    active: classes.sortLabelActive,
                    icon: classes.sortLabelIcon,
                }}
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
          </MyTableCell>
        ))}
      </MyTableRow>
    </TableHead>
  );
}

const ShowTableBody = ({
    MyTableRow, rowsData, order, orderBy, handleColorSelection, classes, page, rowsPerPage, setSelected, selected,
}) => {
    const isSelected = (name) => selected.indexOf(name) !== -1;

    /*
     Do not need too many spaces when have a few data
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsData.length - page * rowsPerPage);
    <MyTableRow style={{ height: (false ? 33 : 53) * emptyRows }}>
    {emptyRows > 0 && (
      <MyTableRow>
        <MyTableCell colSpan={6} />
      </MyTableRow>
    )}
     */
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

    return(
        <TableBody>
          {stableSort(rowsData, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const isItemSelected = isSelected(row.name);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <MyTableRow
                  hover
                  onClick={(event) => {
                    handleClick(event, row.name)
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.name}
                  selected={isItemSelected}
                >
                  <MyTableCell padding="checkbox">
                    <Checkbox
                      classes={{
                          root: classes.colorCheckBox
                      }}
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </MyTableCell>
                  <MyTableCell component="th" id={labelId} scope="row" padding="none">
                    {row.name}
                  </MyTableCell>
                  <MyTableCell align="left" style={{ fontSize: '15px', padding: '16px 0px', }}>{row.phone}</MyTableCell>
                </MyTableRow>
              );
            })}
        </TableBody>
    );
};

// HELPERS
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
// END HELPERS
