const get =  require('lodash.get');


const obj = {
    "bizPromotions": {
        "coupons": {
            "firstOrder": {
                "name": "10% de desconto na primeira compra",
                "isActivated": false
            }
        }
    },
    "bizOwner": "Febro...",
    "bizName": "Sexy Store",
    "bizAddress": "Rua 28 de Dezembro - Manaus",
    "bizCnpj": "023248823212321",
    "bizSlogon": "Lingeries e Produtos Eróticos",
    "bizEmail": "mr.febro@gmail.com",
    "bizWhatsapp": "92995066603",
    "bizWebsite": "https://babadoo.herokuapp.com",
    "bizFacebook": "",
    "bizInstagram": "",
    "bizDev": {
        "name": "Febro",
        "slogon": "Projetos Web",
        "email": "febro.projetosweb@gmail.com"
    },
    "bizShippingRates": {
        "local": {
            "main": 15,
            "secondary": 25,
            "third": 100
        }
    },
    "bizWorkingHours": {
        "breakTime": false,
        "monday": {"start": 7, "end": 19, "dayOff": false},
        "tuesday": {"start": 7, "end": 19, "dayOff": false},
        "wednesday": {"start": 7, "end": 19, "dayOff": false},
        "thirsday": {"start": 7, "end": 19, "dayOff": false},
        "friday": {"start": 7, "end": 19, "dayOff": false},
        "saturday": {"start": 7, "end": 19, "dayOff": false},
        "sunday": {"start": 7, "end": 19, "dayOff": true}
    }
}

const objToUpdate = {
    "bizName": 'fdsfdsfdsfdsfds'
}

function updateKey(obj, objToUpdate) {
    let pathOrKey = Object.keys(objToUpdate)[0];
    const value = objToUpdate[pathOrKey];

    // if find a dot, means the obj is nested and we need to specify the target key.
    if(pathOrKey.includes(".")) {
        let ind = pathOrKey.lastIndexOf(".");
        const path = pathOrKey.substr(0, ind);
        const key = pathOrKey.slice(ind + 1);
        get(obj, path)[key] = value;
    } else {
        obj[pathOrKey] = value;
    }
}

updateKey(obj, objToUpdate);
console.log(obj.bizName);
console.log(obj.bizPromotions.coupons.firstOrder.isActivated);





