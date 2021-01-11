// automatically format CPF 000.000.000-00
// do not forgot to insert a maxLength to 14 in the inputProps in the TextField.
export default function autoCpfMaskBr(cpf) {
    if (!cpf) return;
    return cpf
        .replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/g, "$1.$2")
        .replace(/^(\d{3}).(\d{3})(\d)/g, "$1.$2.$3")
        .replace(/(\d{3}).(\d{3}).(\d{3})(\d)/, "$1.$2.$3-$4");
}
