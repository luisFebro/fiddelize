// depracated by autoCpfMaskBr.js

export function removeCpfMaskBr(number) {
    const regEx = /(\.|-)/gi
    return number.toString().replace(regEx, "");
}

export default function cpfMaskBr(cpf) {
    const isNotString = typeof cpf !== "string";
    if(isNotString) {
        cpf = cpf.toString().trim().replace(/\s/g, '');
    } else {
        cpf = cpf.trim().replace(/\s/g, '');
    }

    const isValidCpfLength = cpf.length === 11;
    let formattedCpf;
    if(isValidCpfLength) {
        const part1 = cpf.substr(0, 3);
        const part2 = cpf.substr(3, 3);
        const part3 = cpf.substr(6, 3);
        const verifier = cpf.slice(-2);
        formattedCpf = `${part1}.${part2}.${part3}-${verifier}`;
        return formattedCpf;
    }

    return cpf;
}