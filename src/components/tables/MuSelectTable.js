/*
required to update material ui to the latest stable version: 4.11 in order to use TableContainer.import
In case of failing or something unusual, the last working version was ^4.7.2
 */
import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteButton from "components/buttons/DeleteButton";
import convertToReal from "utils/numbers/convertToReal";
import ButtonFab from "../buttons/material-ui/ButtonFab";

const MyTableCell = withStyles({
    root: {
        color: "var(--themeP) !important",
        font: "bold 17px var(--mainFont)",
    },
    head: { color: "#fff !important", background: "var(--themeP) !important" },
})(TableCell);

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: (props) => props.marginBottom || theme.spacing(2),
    },
    table: {
        minWidth: 300,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
    colorCheckBox: {
        color: "var(--themeP) !important",
    },
    paginationRoot: {
        marginBottom: (props) => props.marginBottom || "50px",
    },
    paginationCaption: {
        font: "bold 17px var(--mainFont)",
        color: "var(--themeP)",
    },
    sortLabelIcon: {
        color: "#fff !important",
        fontSize: "30px",
    },
    sortLabelActive: {
        color: "#fff !important",
    },
    tableCellStyle: {
        fontSize: "15px !important",
        padding: "16px 0",
    },
}));

/* headCells and rowsData usage example
const headCells = [
    { id: "date", numeric: false, disablePadding: false, label: "Data" },
    { id: "capital", numeric: true, disablePadding: false, label: "Qtde. Cota" },
    {
        id: "base",
        numeric: true,
        disablePadding: false,
        label: "Qtde. Base",
    },
    { id: "market", numeric: true, disablePadding: false, label: "P. mercado" },
    { id: "strategy", numeric: false, disablePadding: false, label: "Estratégia" },
    { id: "fee", numeric: false, disablePadding: false, label: "Taxa" },
];

const tableListTest = [
    {
        date: "23/07/21",
        capital: "R$ 83.34 (100%)",
        base: 0.004563,
        market: 177.841,
        strategy: "emaBull9OVer20",
        fee: "R$ 0.25 (0.3%)",
    }
]

each row need to have the same id specified in the headCells
*/

// LESSON: fields only accept strings and numbers, if dates will throw an error
export default function MuSelectTable({
    headCells = [],
    rowsData = [],
    emptySelection = false,
    loading,
    callback,
    enumeration = "checkbox",
    needMainTitle = true,
    needHighlightColor = true,
    marginBottom,
    deleteBtns = false, // option to delete a row
    callbackDeleteBtns,
    needRestoreBtn = true,
}) {
    const classes = useStyles({ marginBottom });
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("name");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [restoreBtn, setRestoreBtn] = React.useState(null);
    const [colorHighlighted, setColorHighlighted] = React.useState(true);

    useEffect(() => {
        if (emptySelection) setSelected([]);
    }, [emptySelection]);

    useEffect(() => {
        if (!loading) setSelected(rowsData.map((contact) => contact.name));
    }, [loading]);

    useRestoreList({
        restoreBtn,
        callbackDeleteBtns,
        deleteBtns,
        rowsData,
        setRestoreBtn,
    });

    const handleColor = () => {
        if (!needHighlightColor) return "#fff !important";
        return colorHighlighted
            ? "rgb(124, 67, 189, 0.1) !important"
            : "#fff !important";
    };

    const getTableRowStyle = ({ colorHighlighted }) => ({
        root: {
            cursor: "pointer",
            backgroundColor: handleColor(),
            "&:nth-of-type(odd)": {
                backgroundColor: !needHighlightColor
                    ? "rgb(124, 67, 189, 0.1) !important"
                    : "",
            },
        },
    });
    const MyTableRow = withStyles(getTableRowStyle({ colorHighlighted }))(
        TableRow
    );

    const handleColorSelection = () => {
        setColorHighlighted((prev) => !prev);
    };

    useEffect(() => {
        if (typeof callback === "function") callback(selected);
    }, [selected]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = () => {
        if (!selected.length) {
            const newSelecteds = rowsData.map((n) => n.name);
            setSelected(newSelecteds);
            setColorHighlighted(true);
        } else {
            setSelected([]);
            setColorHighlighted(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const tableBodyProps = {
        enumeration,
        deleteBtns,
        callbackDeleteBtns,
        headCells,
        handleColorSelection,
        MyTableRow,
        rowsData,
        order,
        orderBy,
        classes,
        page,
        rowsPerPage,
        setSelected,
        selected,
        setRestoreBtn,
        needRestoreBtn,
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <ShowTableMainTitle
                    needMainTitle={needMainTitle}
                    rowsData={rowsData}
                    numSelected={selected.length}
                    selected={selected}
                    onSelectAllClick={handleSelectAllClick}
                />
                {loading ? (
                    <div className="my-5 text-center text-purple font-weight-bold text-subtitle">
                        Carregando lista...
                    </div>
                ) : (
                    <Fragment>
                        <TableContainer>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size="medium"
                                aria-label="enhanced table"
                            >
                                <ShowTableHead
                                    classes={classes}
                                    order={order}
                                    enumeration={enumeration}
                                    MyTableRow={MyTableRow}
                                    selected={selected}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    headCells={headCells}
                                />
                                <ShowTableBody {...tableBodyProps} />
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 50]}
                            nextIconButtonProps={{
                                style: { width: "30px" },
                            }}
                            classes={{
                                root: classes.paginationRoot,
                                caption: classes.paginationCaption,
                                input: classes.paginationCaption,
                            }}
                            component="div"
                            labelRowsPerPage=""
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${
                                    count !== -1 ? count : `mais do que ${to}`
                                }`
                            }
                            count={rowsData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={null}
                        />
                    </Fragment>
                )}
            </Paper>
            {deleteBtns && restoreBtn && (
                <div className="animated fadeInUp">
                    <ButtonFab
                        size="medium"
                        zIndex={1000}
                        position="absolute"
                        bottom={40}
                        right={10}
                        title="Restaurar Lista"
                        onClick={() => {
                            setRestoreBtn(false);
                        }}
                        backgroundColor="var(--themeSDark)"
                        variant="extended"
                    />
                </div>
            )}
        </div>
    );
}

const useMainTitle = makeStyles((theme) => ({
    root: {
        textAlign: "center",
        justifyContent: "center",
        flexFlow: "column wrap",
    },
    mainTitle: {
        textAlign: "center",
        font: "bold 25px var(--mainFont)",
        color: "var(--themeP)",
        flex: 1,
    },
}));

const ShowTableMainTitle = ({
    needMainTitle,
    rowsData,
    listName = "",
    numSelected,
    selected,
    onSelectAllClick,
}) => {
    const classes = useMainTitle();

    const showToggleCheckBtn = () =>
        Boolean(rowsData && rowsData.length) && (
            <section className="my-3">
                <ButtonFab
                    size="medium"
                    width="230px"
                    needTxtNoWrap
                    title={selected.length ? "Desmarcar todos" : "Marcar Todos"}
                    onClick={onSelectAllClick}
                    backgroundColor="var(--themeSDark--default)"
                    variant="extended"
                    position="relative"
                />
            </section>
        );

    return (
        needMainTitle && (
            <Toolbar className={classes.root}>
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
        )
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
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function ShowTableHead(props) {
    const {
        MyTableRow,
        classes,
        order,
        orderBy,
        onRequestSort,
        headCells,
        enumeration,
    } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <MyTableRow>
                {enumeration !== " " && (
                    <MyTableCell
                        padding="checkbox"
                        style={{ fontSize: "15px !important" }}
                    >
                        <Checkbox
                            indeterminate={null}
                            checked={null}
                            onChange={null}
                            style={{ display: "none" }}
                            inputProps={{ "aria-label": "select all desserts" }}
                        />
                    </MyTableCell>
                )}
                {headCells.map((headCell) => (
                    <MyTableCell
                        key={headCell.id}
                        align={headCell.headAlign || "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            classes={{
                                active: classes.sortLabelActive,
                                icon: classes.sortLabelIcon,
                            }}
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
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
    enumeration,
    headCells,
    MyTableRow,
    rowsData,
    order,
    orderBy,
    handleColorSelection,
    classes,
    page,
    rowsPerPage,
    setSelected,
    selected,
    deleteBtns,
    callbackDeleteBtns,
    setRestoreBtn,
    needRestoreBtn,
}) => {
    const isSelected = (name) => selected.indexOf(name) !== -1;

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
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const MapRows = (rowData) =>
        headCells.map((head, ind) => {
            const handleCellContent = () => {
                if (head.id === "status")
                    return getStatusColor(rowData[head.id]);
                if (head.id === "name") return rowData[head.id].cap();
                if (head.numeric) return convertToReal(rowData[head.id]);
                if (head.isImg)
                    return (
                        <div className="mr-1">
                            <img
                                src={rowData[head.id]}
                                width={70}
                                height={70}
                                alt={rowData[head.service]}
                            />
                        </div>
                    );

                return rowData[head.id];
            };

            return (
                <Fragment key={ind}>
                    <MyTableCell
                        id={ind}
                        padding="none"
                        align={head.align || "left"}
                        style={{ fontSize: "15px", padding: "16px 0px" }}
                    >
                        {handleCellContent()}
                    </MyTableCell>
                </Fragment>
            );
        });

    return (
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
                                handleClick(event, row.name);
                            }}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name || index}
                            selected={isItemSelected}
                        >
                            {enumeration === "checkbox" && (
                                <MyTableCell padding="checkbox">
                                    <Checkbox
                                        classes={{
                                            root: classes.colorCheckBox,
                                        }}
                                        checked={isItemSelected}
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                    />
                                </MyTableCell>
                            )}

                            {enumeration === "number" && (
                                <MyTableCell>{index + 1}</MyTableCell>
                            )}

                            {MapRows(row)}
                            {deleteBtns && (
                                <MyTableCell>
                                    <DeleteButton
                                        onClick={() => {
                                            callbackDeleteBtns(index);
                                            if (needRestoreBtn)
                                                setRestoreBtn(true);
                                        }}
                                    />
                                </MyTableCell>
                            )}
                        </MyTableRow>
                    );
                })}
        </TableBody>
    );
};

// HOOKS
function useRestoreList({
    restoreBtn,
    callbackDeleteBtns,
    deleteBtns,
    rowsData = [],
    setRestoreBtn,
}) {
    const [recoverList, setRecoverList] = useState(null);

    useEffect(() => {
        if (!deleteBtns) return null;
        // set only if it is the entire initial list of items
        if (rowsData.length && !recoverList) return setRecoverList(rowsData);

        // restoreBtn has three states: null, false (restore all), true (show restoreBtn)
        const isRestore = restoreBtn === false;
        if (isRestore) {
            setRecoverList(null);
            setRestoreBtn(null);
            callbackDeleteBtns(null, { recoverList, restoreAll: true });
        }
        return null;
        // eslint-disable-next-line
    }, [rowsData, recoverList, restoreBtn]);
}
// END HOOKS

// HELPERS
function getStatusColor(status) {
    const getPill = (status, color) => (
        <p
            style={{
                background: color,
                padding: "3px",
                color: "#fff",
                borderRadius: "30%",
            }}
            className="m-0 text-shadow d-inline-block"
        >
            {status}
        </p>
    );

    switch (status) {
        case "VISTO ✔":
            return getPill(status, "var(--mainGreen)");
        case "enviado":
            return getPill(status, "var(--lightBlue)");
        case "agendado":
            return getPill(status, "grey");
        case "cancelado":
            return getPill(status, "var(--mainRed)");
        case "falhou":
            return getPill(status, "var(--expenseRed)");
        default:
            return getPill(status, "var(--expenseRed)");
    }
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
    return order === "desc"
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
