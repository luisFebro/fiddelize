import React, { Fragment } from 'react';
import Title from '../../components/Title';
import { data } from '../../data/dataWorkingHour';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//End Material UI

const useStyles = makeStyles(theme => ({
    root: {
        width: '95%',
        margin: 'auto'
    },
    paper: {
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: '400px',
        fontSize: '1.5rem'
    }
}));

function createData(weekday, workingHour) {
    return { weekday, workingHour };
}

const rows = [];
data.forEach(info => {
    rows.push(createData(info.weekDay, info.closeDay ? 'Fechado' : `das ${info.from}:00 até as ${info.to}:00`));
});

export default function WorkingHour() {
    const classes = useStyles();

    return (
        <Fragment>
            <Title title="Horário de Funcionamento" />
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Table className={classes.table} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dia da Semana</TableCell>
                                <TableCell align="right">Horário</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.weekday}>
                                    <TableCell component="th" scope="row">
                                        {row.weekday}
                                    </TableCell>
                                    <TableCell align="right">{row.workingHour}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </Fragment>
    );
}
