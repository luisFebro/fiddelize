// THIS REALLY WORKS ON BARCODE SCANNER APP
// GENERATE CUSTOM BARCODE: https://datalog.github.io/demo/barcode-svg/
/*
last default barcode customization:
BARCode({
     msg :  "Fiddelize Invista"
    ,dim : [ 0, 80]
    ,pad : [ 20, 6]
    ,pal : ["#7b00a8"]
});
 */
/**
	https://github.com/datalog/barcode-svg
	under MIT license

	# barcode.js has no dependencies

	Copyright (c) 2020 Constantine
 */

function BARCode(B) {
    function c128(c) {
        c = c.charCodeAt(0);

        return c > 126 ? (c == 128 ? 0 : c - 50) : c > 32 ? c - 32 : 0;
    }

    function check(o) {
        let r = 0;
        let c = o.length;

        while (c) r += c-- * c128(o[c]);

        return r % 103;
    }

    function def(i) {
        if (i > 106)
            console.warn("BCode: {bad char} was used and it was replaced by X"),
                (i = 56),
                (er = 1);

        return [
            1740,
            1644,
            1638,
            1176,
            1164,
            1100,
            1224,
            1220,
            1124,
            1608,
            1604,
            1572,
            1436,
            1244,
            1230,
            1484,
            1260,
            1254,
            1650,
            1628,
            1614,
            1764,
            1652,
            1902,
            1868,
            1836,
            1830,
            1892,
            1844,
            1842,
            1752,
            1734,
            1590,
            1304,
            1112,
            1094,
            1416,
            1128,
            1122,
            1672,
            1576,
            1570,
            1464,
            1422,
            1134,
            1496,
            1478,
            1142,
            1910,
            1678,
            1582,
            1768,
            1762,
            1774,
            1880,
            1862,
            1814,
            1896,
            1890,
            1818,
            1914,
            1602,
            1930,
            1328,
            1292,
            1200,
            1158,
            1068,
            1062,
            1424,
            1412,
            1232,
            1218,
            1076,
            1074,
            1554,
            1616,
            1978,
            1556,
            1146,
            1340,
            1212,
            1182,
            1508,
            1268,
            1266,
            1956,
            1940,
            1938,
            1758,
            1782,
            1974,
            1400,
            1310,
            1118,
            1512,
            1506,
            1960,
            1954,
            1502,
            1518,
            1886,
            1966,
            1668,
            1680,
            1692,
            6379,
        ][i].toString(2);
    }

    function bin(o) {
        const r = [];
        let c = o.length;

        while (c) r[--c] = parseInt(o[c]);

        return r;
    }

    function encode(o) {
        const r = [];
        let c = o.length;

        while (c) r[--c] = def(c128(o[c]));

        return bin(def(104) + r.join("") + def(check(o) + 1) + def(106));
    }

    function abs(o) {
        return Math.abs(parseInt(o)) || 0;
    }

    function ishex(c) {
        return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(c);
    }

    const b = typeof B === "string" ? { msg: B } : B || {};
    let { msg } = b;
    let dir = 0;
    let l = 0;
    const dim = b.dim || [320, 80];
    const pad = b.pad || [20, 16];
    const pal = b.pal || ["#000"];
    let w = abs(dim[0]);
    let h = abs(dim[1]);
    let px = abs(pad[0]);
    let py = abs(pad[1]);
    let fg = pal[0];
    let bg = pal[1];
    let sx = 1;
    let sy = 1;
    var er = 0;

    if (!msg || typeof msg !== "string") {
        console.warn("BCode: Expected {msg} should be not empty string!");

        msg = "error!";
        er = 1;
    }

    msg = encode(msg);
    l = msg.length;

    /* ecc: reset to default values and relative width */
    if (w == 0 && h == 0) (px = 20), (py = 16), (w = 2 * (l + px)), (h = 80);

    dir = h > w;

    /* deal with auto width or height */
    if (w == 0) (w = 2 * (l + px)), (dir = 0);
    if (h == 0) (h = 2 * (l + py)), (dir = 1);

    if (w < px) {
        px = w;
        console.warn(
            "BCode: Expected {pad} value could not be bigger than {dim} value"
        );
    }

    if (h < py) {
        py = h;
        console.warn(
            "BCode: Expected {pad} value could not be bigger than {dim} value"
        );
    }

    if (dir) sy = l;
    else sx = l;

    sx = ((w - 2 * px) / sx).toFixed(4);
    sy = ((h - 2 * py) / sy).toFixed(4);

    if (er || !ishex(fg) || (bg && !ishex(bg))) {
        (fg = "#b11"), (bg = "#fee");
        console.warn("BCode: Please, double check barcode params");
    }

    return (function () {
        function svg(n, a) {
            n = document.createElementNS(ns, n);

            for (const o in a || {}) {
                n.setAttribute(o, a[o]);
            }

            return n;
        }

        let r;
        var ns = "http://www.w3.org/2000/svg";
        let path = "";
        let c = l;
        let d = 0;

        while (c) {
            msg[--c] &&
                ++d &&
                !msg[c - 1] &&
                ((path += dir
                    ? `M1,${c}H0v${d}h1v-${d}z`
                    : `M${c},1h${d}V0h-${d}v1z`),
                (d = 0));
        }

        r = svg("svg", {
            viewBox: [0, 0, w, h].join(" "),
            width: w,
            height: h,
            fill: fg,
            "shape-rendering": "crispEdges",
            xmlns: ns,
            version: "1.1",
        });

        if (bg)
            r.appendChild(
                svg("path", {
                    fill: bg,
                    d: `M0,0V${h}H${w}V0H0Z`,
                })
            );

        r.appendChild(
            svg("path", {
                transform: `matrix(${[sx, 0, 0, sy, px, py]})`,
                d: path,
            })
        );

        return r;
    })();
}
