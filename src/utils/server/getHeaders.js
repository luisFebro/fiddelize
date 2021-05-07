// getHeaderToken will be DEPRACATED
export const getHeaderToken = (token) => {
    if (!token) {
        token = localStorage.getItem("token");
    }

    const config = {
        headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
        },
    };

    return config;
};
