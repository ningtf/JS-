var cryPP = {
    excutePP: function(r, e) {
        for (var n = "", t = 0; t < r.length; t++) {
            var o = e ^ r.charCodeAt(t);
            n += String.fromCharCode(o)
        }
        return encodeURIComponent(n)
    },
    generateMix: function(r) {
        return Math.ceil(1e3 * Math.random())
    }
}
    function getpwd(pwd) {

        var kk = cryPP.generateMix();
        return cryPP.excutePP(pwd, kk)
    };