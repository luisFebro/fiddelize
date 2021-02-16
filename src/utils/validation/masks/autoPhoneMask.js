// reference: https://pt.stackoverflow.com/questions/272663/como-fazer-um-regex-que-aceita-8-ou-9-d%C3%ADgitos-com-ddd-de-2-d%C3%ADgitos
// https://pt.stackoverflow.com/questions/46672/como-fazer-uma-express%C3%A3o-regular-para-telefone-celular
/* FATOS
Não existe ddd que inicia com 0
Hoje em dia todos os telefones celulares no Brasil têm nove dígitos e iniciam com o dígito 9
Todos os telefones fixos têm 8 dígitos e nunca iniciam com o dígito 9.
Telefones fixos começam com dígitos de 2 a 8.
Telefones celulares começam com 9 e têm um segundo dígito de 1 a 9.
O primeiro dígito nunca será 0 ou 1.
Celulares não podem começar com 90 porque esse é o prefixo para ligações a cobrar.
invalid num = "92902817363"
Número máximo de dígitos: 11
 */

// LESSON - the following regex pattern should include all modified patterns applied before like parantheses and space below.
export default function autoPhoneMask(phone) {
    return (
        phone
            // \D prevent any character other than digits to be inserted
            // warning: this \D also prevents to delete non-digit characters
            // .replace(/\D/g, "")
            .replace(/^([1-9]{2})/g, "($1) ")
            .replace(/^\(([1-9]{2})\)\s([9]|9[1-9]\d{0,3})/g, "($1) $2")
            .replace(/^\(([1-9]{2})\)\s(\d{5})(\d)/g, "($1) $2-$3")
    );
}
