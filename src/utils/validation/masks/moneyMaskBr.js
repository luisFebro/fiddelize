// resource: https://pt.stackoverflow.com/questions/166405/mascara-em-campo-input

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

// LESSON IMPORTANT: in order to convert to default programming dot floated format,
// you should use convertBrToDollar from convertDotComma to get the right converted value.
export default function moneyMaskBr(targetStr) {
    if (!targetStr) return;
    // const key = (!ev) ? window.event.keyCode : ev.which;
    const value = targetStr.replace(/[^\d]+/gi, "").reverse();
    let result = "";

    const mask = "##.###.###,##".reverse();
    for (let x = 0, y = 0; x < mask.length && y < value.length; ) {
        if (mask.charAt(x) != "#") {
            result += mask.charAt(x);
            x++;
        } else {
            result += value.charAt(y);
            y++;
            x++;
        }
    }

    return result.reverse();
}

/* USAGE
<p>Exemplo de mask para Moeda em JavaScript</p>
<input type="Text" size="12" onKeyUp="mascaraMoeda(this, event)"  value="">
 */
