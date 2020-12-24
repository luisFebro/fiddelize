const axios = require("axios");
const { payUrl, token, email } = require("../globalVar");

// A API de Transferência permite transferir o saldo de sua conta PagSeguro para outra conta (do PagSeguro).

// not working - UNAUTHORIZED": "Ação não permitida para as credenciais fornecidas."

// GET - only work on production
// Esta consulta não é obrigatória para realizar a transferência.
exports.getBalance = async (req, res) => {
    const params = {
        email,
        token: process.env.TOKEN_PAGSEGURO_PROD,
    };

    const config = {
        method: "get",
        url: `https://ws.pagseguro.uol.com.br/transfer/balance`,
        params,
        headers: {
            "Content-Type": "application/vnd.pagseguro.com.br.v1+json",
        },
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e.response.data });
    });
    if (!response) return;

    res.json(response);
};

// POST
exports.requestAuthorization = async (req, res) => {
    const params = {
        email,
        token: process.env.TOKEN_PAGSEGURO_PROD,
    };

    const config = {
        method: "post",
        url: `https://ws.pagseguro.uol.com.br/transfer/requests`,
        params,
        headers: {
            "Content-Type": "application/vnd.pagseguro.com.br.v1+json",
        },
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e.response.data });
    });
    if (!response) return;

    res.json(response);
};

// POST
exports.transfer = async (req, res) => {
    const params = {
        email,
        token: process.env.TOKEN_PAGSEGURO_PROD,
    };

    const config = {
        method: "post",
        url: `https://ws.pagseguro.uol.com.br/transfer/authorize`,
        params,
        headers: {
            "Content-Type": "application/vnd.pagseguro.com.br.v1+json",
        },
    };

    const response = await axios(config).catch((e) => {
        res.json({ error: e.response.data });
    });
    if (!response) return;

    res.json(response);
};
