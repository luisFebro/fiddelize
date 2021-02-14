// return the translation of a target field key and after use .includes to detect if there is key in a message.
// all translated words should be in lowercase.
const dbCommonFieldsTrans = {
    name: "nome",
    password: "senha",
    user: "usuário",
    email: "email",
    whatsapp: "whatsapp",
    cpf: "cpf",
    birthday: "data de aniversário",
    phone: "contato",
    maritalStatus: "estado civil",
};

const findAndConvertFieldNameToPtBr = (key) => {
    if (typeof dbCommonFieldsTrans[key] === "undefined") {
        return "";
    }
    return dbCommonFieldsTrans[key];
};

/**
 * return an obj of booleans indicating whether a message (portuguese) got a certain word.
 * @param  {String} msg
 * @param  {Array} fields array with all obj keys
 * @return {Object}
 */
export default function detectErrorField(msg = "", fields) {
    msg = msg.toLowerCase();

    const errorFoundIn = {};

    // populate keys to obj
    fields.forEach((field) => {
        errorFoundIn[field] = false;
    });

    // keys in the object
    const keys = Object.keys(errorFoundIn);

    // detect if the message got a name key, if so then assign true, else all fields got a problem.
    let foundAnError = false;
    let keyBrPt = "";
    keys.forEach((key) => {
        keyBrPt = findAndConvertFieldNameToPtBr(key);
        if (msg.includes(keyBrPt)) {
            errorFoundIn[key] = true;
            foundAnError = true;
        }
    });

    // if no error found, then the error involves all fields.
    if (foundAnError === true) {
        errorFoundIn.allFields = false;
    } else {
        errorFoundIn.allFields = true;
    }

    return errorFoundIn;
}

// eg
/*
const msg = "Esse USUÁRIO já existe";
const fields = ['user', 'name', 'email', 'password', 'whatsapp']

console.log(findFieldWhichGotError(msg, fields));
##
{ user: true,
  name: false,
  email: false,
  password: false,
  whatsapp: false,
  allFields: false }
 */
