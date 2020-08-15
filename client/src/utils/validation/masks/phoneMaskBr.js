// referenec: https://www.alura.com.br/artigos/criando-uma-mascara-de-telefone-com-javascript
// usage:
// onblur="mascaraDeTelefone(this)"
// onfocus="tiraHifen(this)"

export default function phoneMaskBr(telefone){
    const isNotString = typeof telefone !== "string";
    if(!telefone) return console.log("Invalid Phone");
    if(isNotString) {
        telefone = telefone.toString().trim(); // replace(/\s/g, '')
    } else {
        telefone = telefone.trim(); // .replace(/\s/g, '')
    }

    const startWithZero = telefone.charAt(0) === "0";

    if(startWithZero) {
        telefone = telefone.slice(1);
    }

    const isValidPhone = [10, 11, 12].includes(telefone.length);

    if(isValidPhone) {
        const wrappedDdd = `(${telefone.substr(0, 2)}) `;
        const isCelular = telefone.length === 11;
        let textoAjustado;
        if(isCelular) {
            const parte1 = telefone.substr(2, 5);
            const parte2 = telefone.substr(7, 4);
            textoAjustado = `${parte1}-${parte2}`
        } else {
            const parte1 = telefone.substr(2, 4);
            const parte2 = telefone.substr(6, 4);
            textoAjustado = `${parte1}-${parte2}`
        }
        telefone = `${wrappedDdd}${textoAjustado}`;
    }
    return telefone;
}

// function dropSymbols(telefone) {
//     const isNotString = typeof telefone !== "string";
//     if(isNotString) {
//         telefone = telefone.toString().trim();
//     } else {
//         telefone = telefone.trim();
//     }

//     const textoAjustado = telefone
//                                 .replace(/\-/g, '')
//                                 .replace(/\(/g, '')
//                                 .replace(/\)/g, '');
//     telefone = textoAjustado;
//     console.log(telefone);
//     return telefone;
// }
