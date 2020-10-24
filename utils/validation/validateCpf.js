// Referenece: geracpf.com || https://github.com/tome-vilela/geracpf/blob/master/jss/all.js
// usage: new CPF().validate(cpf)
function CPF() {
    this.validate = function (cpf) {
        if (!cpf) return false;
        const isNotString = typeof cpf !== "string"; // n1
        isNotString ? (cpf = cpf.toString().trim()) : null;

        var sum = 0;
        var remainder;

        cpf = cpf.replace(".", "").replace(".", "").replace("-", "").trim();
        var allEqual = true;
        for (var i = 0; i < cpf.length - 1; i++) {
            if (cpf[i] != cpf[i + 1]) allEqual = false;
        }
        if (allEqual) return false;

        for (i = 1; i <= 9; i++)
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;

        if (remainder == 10 || remainder == 11) remainder = 0;
        if (remainder != parseInt(cpf.substring(9, 10))) return false;

        sum = 0;
        for (i = 1; i <= 10; i++)
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;

        if (remainder == 10 || remainder == 11) remainder = 0;
        if (remainder != parseInt(cpf.substring(10, 11))) return false;

        return true;
    };
}

module.exports = CPF;
/* COMMENTS
n1:
// This condition will work well only if the cpf does not start with zero.
//Better practice is get a string type value.
*/
