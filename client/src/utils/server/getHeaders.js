// Headers to send to server / Type JSON
export const getHeaderJson = {
    headers: {
        'Content-Type': 'application/json'
    }
};

// for axios http request
// need be the value of headers: { returnedValue };
export const chooseHeader = ({ token, needAuth = true })  => {
    if(needAuth) {
        return {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    } else {
        return undefined; //{ 'Content-type': 'application/json' }
    }
}

export const getHeaderToken = token => {
    if(!token) {
        token = localStorage.getItem("token");
    }

    const config = {
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    };

    return config;
};