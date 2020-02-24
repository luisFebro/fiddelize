import React, { useEffect, useState } from 'react';
import ButtonMulti from '../components/buttons/material-ui/ButtonMulti';
import { useStoreDispatch } from 'easy-peasy';
import { Link } from 'react-router-dom';
import LoadingThreeDots from '../components/loadingIndicators/LoadingThreeDots';
import Paper from '@material-ui/core/Paper';
import { readAdmin } from '../redux/actions/adminActions';
import isThisApp from '../utils/window/isThisApp';

export default function RegulationPage() {
    const [data, setData] = useState({
        regulationText: '',
    })
    const { regulationText } = data;

    const dispatch = useStoreDispatch();

    useEffect(() => {
        readAdmin(dispatch)
        .then(res => {
            if(res.status !== 200) return console.log(res.data.msg);
            setData({ regulationText: res.data.regulationText })
        })
    }, [])

    return (
        <div className="margin-auto-80">
            <div className="d-flex justify-content-start">
                <Link to={isThisApp() ? "/mobile-app" : "/"}>
                    <ButtonMulti
                        title="voltar"
                        color="var(--mainWhite)"
                        backgroundColor="var(--mainPink)"
                        backColorOnHover="var(--mainPink)"
                        iconFontAwesome="fas fa-home"
                        textTransform='uppercase'
                    />
                </Link>
            </div>
            <div>
                <Paper>
                    <div style={{minHeight: '400px'}} className="text-justify p-5 text-container">
                        <pre style={{whiteSpace: 'pre-line'}}>
                            {regulationText.length === 0
                            ? <LoadingThreeDots />
                            : regulationText}
                        </pre>
                    </div>
                </Paper>
            </div>
        </div>
    );
}