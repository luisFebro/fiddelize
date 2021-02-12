import React, { useState } from 'react';
import InstagramLogin from 'react-instagram-login';

export default function Main() {
    const stateData = useState({
        isUserLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    });
    const [data, setData] = stateData;

    const responseInstagram = response => {
        console.log(response);
    };

    return (
        <div>
            <InstagramLogin
                clientId={process.env.REACT_APP_SOCIAL_INSTAGRAM}
                buttonText="Entrar com Instagram"
                onSuccess={responseInstagram}
                onFailure={responseInstagram}
            />
        </div>
    );
}
