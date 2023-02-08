var hexcase = 0,
    b64pad = "",
    chrsz = 8;

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(e) {
        var t = "",
            n, r, i, s, o, u, a, f = 0;
        e = _utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            isNaN(r) ? u = a = 64 : isNaN(i) && (a = 64);
            t = t + _keyStr.charAt(s) + _keyStr.charAt(o) + _keyStr.charAt(u) + _keyStr.charAt(a)
        }
        return t
    };
    this.decode = function(e) {
        var t = "",
            n, r, i, s, o, u, a, f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = _keyStr.indexOf(e.charAt(f++));
            o = _keyStr.indexOf(e.charAt(f++));
            u = _keyStr.indexOf(e.charAt(f++));
            a = _keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t += String.fromCharCode(n);
            u != 64 && (t += String.fromCharCode(r));
            a != 64 && (t += String.fromCharCode(i))
        }
        t = _utf8_decode(t);
        return t
    };
    _utf8_encode = function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) t += String.fromCharCode(r);
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    };
    _utf8_decode = function(e) {
        var t = "",
            n = 0,
            r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

function hex_md5(e) {
    return binl2hex(core_md5(str2binl(e), e.length * chrsz))
}

function b64_md5(e) {
    return binl2b64(core_md5(str2binl(e), e.length * chrsz))
}

function str_md5(e) {
    return binl2str(core_md5(str2binl(e), e.length * chrsz))
}

function hex_hmac_md5(e, t) {
    return binl2hex(core_hmac_md5(e, t))
}

function b64_hmac_md5(e, t) {
    return binl2b64(core_hmac_md5(e, t))
}

function str_hmac_md5(e, t) {
    return binl2str(core_hmac_md5(e, t))
}

function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72"
}

function core_md5(e, t) {
    e[t >> 5] |= 128 << t % 32;
    e[(t + 64 >>> 9 << 4) + 14] = t;
    var n = 1732584193,
        r = -271733879,
        i = -1732584194,
        s = 271733878;
    for (var o = 0; o < e.length; o += 16) {
        var u = n,
            a = r,
            f = i,
            l = s;
        n = md5_ff(n, r, i, s, e[o + 0], 7, -680876936);
        s = md5_ff(s, n, r, i, e[o + 1], 12, -389564586);
        i = md5_ff(i, s, n, r, e[o + 2], 17, 606105819);
        r = md5_ff(r, i, s, n, e[o + 3], 22, -1044525330);
        n = md5_ff(n, r, i, s, e[o + 4], 7, -176418897);
        s = md5_ff(s, n, r, i, e[o + 5], 12, 1200080426);
        i = md5_ff(i, s, n, r, e[o + 6], 17, -1473231341);
        r = md5_ff(r, i, s, n, e[o + 7], 22, -45705983);
        n = md5_ff(n, r, i, s, e[o + 8], 7, 1770035416);
        s = md5_ff(s, n, r, i, e[o + 9], 12, -1958414417);
        i = md5_ff(i, s, n, r, e[o + 10], 17, -42063);
        r = md5_ff(r, i, s, n, e[o + 11], 22, -1990404162);
        n = md5_ff(n, r, i, s, e[o + 12], 7, 1804603682);
        s = md5_ff(s, n, r, i, e[o + 13], 12, -40341101);
        i = md5_ff(i, s, n, r, e[o + 14], 17, -1502002290);
        r = md5_ff(r, i, s, n, e[o + 15], 22, 1236535329);
        n = md5_gg(n, r, i, s, e[o + 1], 5, -165796510);
        s = md5_gg(s, n, r, i, e[o + 6], 9, -1069501632);
        i = md5_gg(i, s, n, r, e[o + 11], 14, 643717713);
        r = md5_gg(r, i, s, n, e[o + 0], 20, -373897302);
        n = md5_gg(n, r, i, s, e[o + 5], 5, -701558691);
        s = md5_gg(s, n, r, i, e[o + 10], 9, 38016083);
        i = md5_gg(i, s, n, r, e[o + 15], 14, -660478335);
        r = md5_gg(r, i, s, n, e[o + 4], 20, -405537848);
        n = md5_gg(n, r, i, s, e[o + 9], 5, 568446438);
        s = md5_gg(s, n, r, i, e[o + 14], 9, -1019803690);
        i = md5_gg(i, s, n, r, e[o + 3], 14, -187363961);
        r = md5_gg(r, i, s, n, e[o + 8], 20, 1163531501);
        n = md5_gg(n, r, i, s, e[o + 13], 5, -1444681467);
        s = md5_gg(s, n, r, i, e[o + 2], 9, -51403784);
        i = md5_gg(i, s, n, r, e[o + 7], 14, 1735328473);
        r = md5_gg(r, i, s, n, e[o + 12], 20, -1926607734);
        n = md5_hh(n, r, i, s, e[o + 5], 4, -378558);
        s = md5_hh(s, n, r, i, e[o + 8], 11, -2022574463);
        i = md5_hh(i, s, n, r, e[o + 11], 16, 1839030562);
        r = md5_hh(r, i, s, n, e[o + 14], 23, -35309556);
        n = md5_hh(n, r, i, s, e[o + 1], 4, -1530992060);
        s = md5_hh(s, n, r, i, e[o + 4], 11, 1272893353);
        i = md5_hh(i, s, n, r, e[o + 7], 16, -155497632);
        r = md5_hh(r, i, s, n, e[o + 10], 23, -1094730640);
        n = md5_hh(n, r, i, s, e[o + 13], 4, 681279174);
        s = md5_hh(s, n, r, i, e[o + 0], 11, -358537222);
        i = md5_hh(i, s, n, r, e[o + 3], 16, -722521979);
        r = md5_hh(r, i, s, n, e[o + 6], 23, 76029189);
        n = md5_hh(n, r, i, s, e[o + 9], 4, -640364487);
        s = md5_hh(s, n, r, i, e[o + 12], 11, -421815835);
        i = md5_hh(i, s, n, r, e[o + 15], 16, 530742520);
        r = md5_hh(r, i, s, n, e[o + 2], 23, -995338651);
        n = md5_ii(n, r, i, s, e[o + 0], 6, -198630844);
        s = md5_ii(s, n, r, i, e[o + 7], 10, 1126891415);
        i = md5_ii(i, s, n, r, e[o + 14], 15, -1416354905);
        r = md5_ii(r, i, s, n, e[o + 5], 21, -57434055);
        n = md5_ii(n, r, i, s, e[o + 12], 6, 1700485571);
        s = md5_ii(s, n, r, i, e[o + 3], 10, -1894986606);
        i = md5_ii(i, s, n, r, e[o + 10], 15, -1051523);
        r = md5_ii(r, i, s, n, e[o + 1], 21, -2054922799);
        n = md5_ii(n, r, i, s, e[o + 8], 6, 1873313359);
        s = md5_ii(s, n, r, i, e[o + 15], 10, -30611744);
        i = md5_ii(i, s, n, r, e[o + 6], 15, -1560198380);
        r = md5_ii(r, i, s, n, e[o + 13], 21, 1309151649);
        n = md5_ii(n, r, i, s, e[o + 4], 6, -145523070);
        s = md5_ii(s, n, r, i, e[o + 11], 10, -1120210379);
        i = md5_ii(i, s, n, r, e[o + 2], 15, 718787259);
        r = md5_ii(r, i, s, n, e[o + 9], 21, -343485551);
        n = safe_add(n, u);
        r = safe_add(r, a);
        i = safe_add(i, f);
        s = safe_add(s, l)
    }
    return Array(n, r, i, s)
}

function md5_cmn(e, t, n, r, i, s) {
    return safe_add(bit_rol(safe_add(safe_add(t, e), safe_add(r, s)), i), n)
}

function md5_ff(e, t, n, r, i, s, o) {
    return md5_cmn(t & n | ~t & r, e, t, i, s, o)
}

function md5_gg(e, t, n, r, i, s, o) {
    return md5_cmn(t & r | n & ~r, e, t, i, s, o)
}

function md5_hh(e, t, n, r, i, s, o) {
    return md5_cmn(t ^ n ^ r, e, t, i, s, o)
}

function md5_ii(e, t, n, r, i, s, o) {
    return md5_cmn(n ^ (t | ~r), e, t, i, s, o)
}

function core_hmac_md5(e, t) {
    var n = str2binl(e);
    n.length > 16 && (n = core_md5(n, e.length * chrsz));
    var r = Array(16),
        i = Array(16);
    for (var s = 0; s < 16; s++) {
        r[s] = n[s] ^ 909522486;
        i[s] = n[s] ^ 1549556828
    }
    var o = core_md5(r.concat(str2binl(t)), 512 + t.length * chrsz);
    return core_md5(i.concat(o), 640)
}

function safe_add(e, t) {
    var n = (e & 65535) + (t & 65535),
        r = (e >> 16) + (t >> 16) + (n >> 16);
    return r << 16 | n & 65535
}

function bit_rol(e, t) {
    return e << t | e >>> 32 - t
}

function str2binl(e) {
    var t = Array(),
        n = (1 << chrsz) - 1;
    for (var r = 0; r < e.length * chrsz; r += chrsz)
    t[r >> 5] |= (e.charCodeAt(r / chrsz) & n) << r % 32;
    return t
}

function binl2str(e) {
    var t = "",
        n = (1 << chrsz) - 1;
    for (var r = 0; r < e.length * 32; r += chrsz)
    t += String.fromCharCode(e[r >> 5] >>> r % 32 & n);
    return t
}

function binl2hex(e) {
    var t = hexcase ? "0123456789ABCDEF" : "0123456789abcdef",
        n = "";
    for (var r = 0; r < e.length * 4; r++)
    n += t.charAt(e[r >> 2] >> r % 4 * 8 + 4 & 15) + t.charAt(e[r >> 2] >> r % 4 * 8 & 15);
    return n
}

function binl2b64(e) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        n = "";
    for (var r = 0; r < e.length * 4; r += 3) {
        var i = (e[r >> 2] >> 8 * (r % 4) & 255) << 16 | (e[r + 1 >> 2] >> 8 * ((r + 1) % 4) & 255) << 8 | e[r + 2 >> 2] >> 8 * ((r + 2) % 4) & 255;
        for (var s = 0; s < 4; s++)
        r * 8 + s * 6 > e.length * 32 ? n += b64pad : n += t.charAt(i >> 6 * (3 - s) & 63)
    }
    return n
}

function secretMethod(e) {
    var t = new Base64,
        n = hex_md5(e),
        r = t.encode(e);
    return t.encode(n.substr(0, 8) + r + n.substr(10, 4))
}