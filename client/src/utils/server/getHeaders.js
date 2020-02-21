// Headers to send to server / Type JSON
export const getHeaderJson = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getHeaderToken = token => {

    const config = {
        headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    };

    return config;
};