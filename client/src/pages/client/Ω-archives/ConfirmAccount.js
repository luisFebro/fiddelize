import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import RedirectPage from '../../components/RedirectPage';
// Redux
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../redux/actions/snackbarActions'
import { confirmUserAccount } from '../../redux/actions/userActions'


export default function ConfirmAccount({ match }) {
    const [redirect, setRedirect] = useState(false);

    const dispatch = useStoreDispatch();

    useEffect(() => {
        const userId = match.params.authUserId;
        confirmUserAccount(userId)
        .then(res => {
            if(res.status !== 200) {
                setRedirect(true);
                showSnackbar(dispatch, res.data.msg, 'error');
                return;
            }
            setRedirect(true);
            showSnackbar(dispatch, res.data.msg, 'success', 7000);
        })

    }, [match.params.authUserId, dispatch]);

    return (
        <div>
            <Title title="Confirmando sua conta..."/>
            <RedirectPage activated={redirect} waitSec={3} />
        </div>
    );
}
