function getpwd() {
    c = new r.RSAKey;
    c.setPublic(a.result.modulus, a.result.publicExponent);
    var d = c.encrypt(b.val())
    return d

}
a.result.modulus RSA加密公钥 私钥
d为加密以后生成的值
b.val()为值