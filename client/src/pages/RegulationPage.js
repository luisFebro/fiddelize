import React, { useEffect, useState } from 'react';
import ButtonMulti from '../components/buttons/material-ui/ButtonMulti';
import { useStoreDispatch } from 'easy-peasy';
import { Link } from 'react-router-dom';
import LoadingThreeDots from '../components/loadingIndicators/LoadingThreeDots';
import Paper from '@material-ui/core/Paper';
import { readAdmin } from '../redux/actions/adminActions';
import isThisApp from '../utils/window/isThisApp';
import moment from 'moment';
moment.updateLocale('pt-br');

export default function RegulationPage() {
    const [data, setData] = useState({
        regulationText: '',
        updatedAt: '',
    })
    const { regulationText, updatedAt } = data;

    const dispatch = useStoreDispatch();

    useEffect(() => {
        readAdmin(dispatch)
        .then(res => {
            if(res.status !== 200) return console.log(res.data.msg);
            setData({ regulationText: res.data.regulationText, updatedAt: res.data.updatedAt })
        })
    }, [])

    const showText = () => (
        <main>
            <Paper>
                <div style={{minHeight: '400px'}} className="text-align text-normal py-4">
                    <pre style={{whiteSpace: 'pre-line', fontFamily: 'var(--mainFont)'}}>
                        {regulationText.length === 0
                        ? <LoadingThreeDots />
                        : regulationText}
                    </pre>
                </div>
            </Paper>
        </main>
    );

    const showTitle = () => (
        <p
            className="text-center text-white text-title my-3"
        >
            REGRAS DO PLANO FIDELIDADE - <span>{new Date().getFullYear()}</span>
        </p>
    );

    const showBackBtn = () => (
        <div className="d-flex justify-content-start mb-5">
            <Link to={isThisApp() ? "/mobile-app" : "/"}>
                <ButtonMulti
                    title="voltar"
                    color="var(--mainWhite)"
                    backgroundColor="var(--themeSDark)"
                    backColorOnHover="var(--themeSDark)"
                    iconFontAwesome="fas fa-home"
                    textTransform='uppercase'
                />
            </Link>
        </div>
    );

    const showTimeStamp = () => (
        <p className="text-small text-white mt-2 mb-3">
            Última atualização:
            <br />
            {moment(updatedAt).format("LL")}{" "}
            ({moment(updatedAt).fromNow()})
        </p>
    );

    return (
        <div className="margin-auto-95">
            {showTitle()}
            {showText()}
            {showTimeStamp()}
            {showBackBtn()}
        </div>
    );
}
