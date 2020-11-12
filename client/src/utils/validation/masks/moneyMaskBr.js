// resource: https://pt.stackoverflow.com/questions/166405/mascara-em-campo-input

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

export default function moneyMaskBr(targetStr) {
    // const key = (!ev) ? window.event.keyCode : ev.which;
    const value = targetStr.replace(/[^\d]+/gi, "").reverse();
    let result = "";

    var mask = "##.###.###,##".reverse();
    for (var x = 0, y = 0; x < mask.length && y < value.length; ) {
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
