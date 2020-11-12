const { roleTypes } = require("./data-by-role/main");

exports.profileSchema = {
    role: {
        type: String,
        default: "cliente-admin",
        enum: [...roleTypes],
    },
    name: {
        type: String,
        trim: true,
        maxlength: 40,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    cpf: {
        type: String,
        // unique: true, do not include because creates a second index to CPF on DB.
    },
    phone: {
        type: String,
    },
    birthday: {
        type: String,
    },
    gender: {
        type: String,
        default: "Não selecionado",
        enum: ["Ele", "Ela"],
    },
};
