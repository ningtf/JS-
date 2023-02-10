var a = 0;

function i(e) {
    return c(o(s(e)))
}
function o(e) {
    return l(u(r(e), 8 * e.length))
}
function c(e) {
    for (var n, t = a ? "0123456789ABCDEF" : "0123456789abcdef", i = "", o = 0; o < e.length; o++) n = e.charCodeAt(o), i += t.charAt(n >>> 4 & 15) + t.charAt(15 & n);
    return i
}
function s(e) {
    var n, t, a = "",
        i = -1;
    while (++i < e.length) n = e.charCodeAt(i), t = i + 1 < e.length ? e.charCodeAt(i + 1) : 0, 55296 <= n && n <= 56319 && 56320 <= t && t <= 57343 && (n = 65536 + ((1023 & n) << 10) + (1023 & t), i++), n <= 127 ? a += String.fromCharCode(n) : n <= 2047 ? a += String.fromCharCode(192 | n >>> 6 & 31, 128 | 63 & n) : n <= 65535 ? a += String.fromCharCode(224 | n >>> 12 & 15, 128 | n >>> 6 & 63, 128 | 63 & n) : n <= 2097151 && (a += String.fromCharCode(240 | n >>> 18 & 7, 128 | n >>> 12 & 63, 128 | n >>> 6 & 63, 128 | 63 & n));
    return a
}
function r(e) {
    for (var n = Array(e.length >> 2), t = 0; t < n.length; t++) n[t] = 0;
    for (t = 0; t < 8 * e.length; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
    return n
}
function l(e) {
    for (var n = "", t = 0; t < 32 * e.length; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
    return n
}
function u(e, n) {
    e[n >> 5] |= 128 << n % 32, e[14 + (n + 64 >>> 9 << 4)] = n;
    for (var t = 1732584193, a = -271733879, i = -1732584194, o = 271733878, c = 0; c < e.length; c += 16) {
        var s = t,
            r = a,
            l = i,
            u = o;
        t = A(t, a, i, o, e[c + 0], 7, -680876936), o = A(o, t, a, i, e[c + 1], 12, -389564586), i = A(i, o, t, a, e[c + 2], 17, 606105819), a = A(a, i, o, t, e[c + 3], 22, -1044525330), t = A(t, a, i, o, e[c + 4], 7, -176418897), o = A(o, t, a, i, e[c + 5], 12, 1200080426), i = A(i, o, t, a, e[c + 6], 17, -1473231341), a = A(a, i, o, t, e[c + 7], 22, -45705983), t = A(t, a, i, o, e[c + 8], 7, 1770035416), o = A(o, t, a, i, e[c + 9], 12, -1958414417), i = A(i, o, t, a, e[c + 10], 17, -42063), a = A(a, i, o, t, e[c + 11], 22, -1990404162), t = A(t, a, i, o, e[c + 12], 7, 1804603682), o = A(o, t, a, i, e[c + 13], 12, -40341101), i = A(i, o, t, a, e[c + 14], 17, -1502002290), a = A(a, i, o, t, e[c + 15], 22, 1236535329), t = h(t, a, i, o, e[c + 1], 5, -165796510), o = h(o, t, a, i, e[c + 6], 9, -1069501632), i = h(i, o, t, a, e[c + 11], 14, 643717713), a = h(a, i, o, t, e[c + 0], 20, -373897302), t = h(t, a, i, o, e[c + 5], 5, -701558691), o = h(o, t, a, i, e[c + 10], 9, 38016083), i = h(i, o, t, a, e[c + 15], 14, -660478335), a = h(a, i, o, t, e[c + 4], 20, -405537848), t = h(t, a, i, o, e[c + 9], 5, 568446438), o = h(o, t, a, i, e[c + 14], 9, -1019803690), i = h(i, o, t, a, e[c + 3], 14, -187363961), a = h(a, i, o, t, e[c + 8], 20, 1163531501), t = h(t, a, i, o, e[c + 13], 5, -1444681467), o = h(o, t, a, i, e[c + 2], 9, -51403784), i = h(i, o, t, a, e[c + 7], 14, 1735328473), a = h(a, i, o, t, e[c + 12], 20, -1926607734), t = m(t, a, i, o, e[c + 5], 4, -378558), o = m(o, t, a, i, e[c + 8], 11, -2022574463), i = m(i, o, t, a, e[c + 11], 16, 1839030562), a = m(a, i, o, t, e[c + 14], 23, -35309556), t = m(t, a, i, o, e[c + 1], 4, -1530992060), o = m(o, t, a, i, e[c + 4], 11, 1272893353), i = m(i, o, t, a, e[c + 7], 16, -155497632), a = m(a, i, o, t, e[c + 10], 23, -1094730640), t = m(t, a, i, o, e[c + 13], 4, 681279174), o = m(o, t, a, i, e[c + 0], 11, -358537222), i = m(i, o, t, a, e[c + 3], 16, -722521979), a = m(a, i, o, t, e[c + 6], 23, 76029189), t = m(t, a, i, o, e[c + 9], 4, -640364487), o = m(o, t, a, i, e[c + 12], 11, -421815835), i = m(i, o, t, a, e[c + 15], 16, 530742520), a = m(a, i, o, t, e[c + 2], 23, -995338651), t = p(t, a, i, o, e[c + 0], 6, -198630844), o = p(o, t, a, i, e[c + 7], 10, 1126891415), i = p(i, o, t, a, e[c + 14], 15, -1416354905), a = p(a, i, o, t, e[c + 5], 21, -57434055), t = p(t, a, i, o, e[c + 12], 6, 1700485571), o = p(o, t, a, i, e[c + 3], 10, -1894986606), i = p(i, o, t, a, e[c + 10], 15, -1051523), a = p(a, i, o, t, e[c + 1], 21, -2054922799), t = p(t, a, i, o, e[c + 8], 6, 1873313359), o = p(o, t, a, i, e[c + 15], 10, -30611744), i = p(i, o, t, a, e[c + 6], 15, -1560198380), a = p(a, i, o, t, e[c + 13], 21, 1309151649), t = p(t, a, i, o, e[c + 4], 6, -145523070), o = p(o, t, a, i, e[c + 11], 10, -1120210379), i = p(i, o, t, a, e[c + 2], 15, 718787259), a = p(a, i, o, t, e[c + 9], 21, -343485551), t = f(t, s), a = f(a, r), i = f(i, l), o = f(o, u)
    }
    return Array(t, a, i, o)
}
function d(e, n, t, a, i, o) {
    return f(g(f(f(n, e), f(a, o)), i), t)
}
function A(e, n, t, a, i, o, c) {
    return d(n & t | ~n & a, e, n, i, o, c)
}
function h(e, n, t, a, i, o, c) {
    return d(n & a | t & ~a, e, n, i, o, c)
}
function m(e, n, t, a, i, o, c) {
    return d(n ^ t ^ a, e, n, i, o, c)
}
function p(e, n, t, a, i, o, c) {
    return d(t ^ (n | ~a), e, n, i, o, c)
}
function f(e, n) {
    var t = (65535 & e) + (65535 & n),
        a = (e >> 16) + (n >> 16) + (t >> 16);
    return a << 16 | 65535 & t
}
function g(e, n) {
    return e << n | e >>> 32 - n
}
function F(e) {
    var n = [],
        t = "";
    for (var a in e) n.push(e[a]);
    for (var i = 0; i < n.length; i++) t += n[i] + "";
    return t += "JzyqgcoojMiQNuQoTlbR5EBT8TsqzJ", t
}
function P(e) {
    for (var n = Object.keys(e).sort(), t = {}, a = 0; a < n.length; a++) t[n[a]] = e[n[a]];
    return t
}
function pwd_sig(pwd) {
    // var password = i(pwd);
	// password_dict = {phoneNum: '16600003519', pwd: password}
	// s = (new Date).getTime()
	var sig = i(F(P(pwd)))
	return {"sig":sig}
}
'cd694a354a6bfac848250bc9634dcc72'
console.log(pwd_sig({phoneNum: '16600003519', pwd: 'e807f1fcf82d132f9bb018ca6738a19f', t: 1675993820739, tenant: 1}))