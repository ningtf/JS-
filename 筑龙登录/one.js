var RSAKey = (function() {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }
    RSAKey.prototype.doPublic = function(x) {
        return x.modPowInt(this.e, this.n)
    };
    RSAKey.prototype.doPrivate = function(x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n)
        }
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p)
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq)
    };
    RSAKey.prototype.setPublic = function(N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16)
        } else {
            console.error("Invalid RSA public key")
        }
    };
    RSAKey.prototype.encrypt = function(text) {
        var maxLength = (this.n.bitLength() + 7) >> 3;
        var m = pkcs1pad2(text, maxLength);
        if (m == null) {
            return null
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null
        }
        var h = c.toString(16);
        var length = h.length;
        for (var i = 0; i < maxLength * 2 - length; i++) {
            h = "0" + h
        }
        return h
    };
    RSAKey.prototype.setPrivate = function(N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16)
        } else {
            console.error("Invalid RSA private key")
        }
    };
    RSAKey.prototype.setPrivateEx = function(N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
            this.p = parseBigInt(P, 16);
            this.q = parseBigInt(Q, 16);
            this.dmp1 = parseBigInt(DP, 16);
            this.dmq1 = parseBigInt(DQ, 16);
            this.coeff = parseBigInt(C, 16)
        } else {
            console.error("Invalid RSA private key")
        }
    };
    RSAKey.prototype.generate = function(B, E) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        for (;;) {
            for (;;) {
                this.p = new BigInteger(B - qs, 1, rng);
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break
                }
            }
            for (;;) {
                this.q = new BigInteger(qs, 1, rng);
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break
            }
        }
    };
    RSAKey.prototype.decrypt = function(ctext) {
        var c = parseBigInt(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3)
    };
    RSAKey.prototype.generateAsync = function(B, E, callback) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        var rsa = this;
        var loop1 = function() {
            var loop4 = function() {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t
                }
                var p1 = rsa.p.subtract(BigInteger.ONE);
                var q1 = rsa.q.subtract(BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function() {
                        callback()
                    }, 0)
                } else {
                    setTimeout(loop1, 0)
                }
            };
            var loop3 = function() {
                rsa.q = nbi();
                rsa.q.fromNumberAsync(qs, 1, rng, function() {
                    rsa.q.subtract(BigInteger.ONE).gcda(ee, function(r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0)
                        } else {
                            setTimeout(loop3, 0)
                        }
                    })
                })
            };
            var loop2 = function() {
                rsa.p = nbi();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function() {
                    rsa.p.subtract(BigInteger.ONE).gcda(ee, function(r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0)
                        } else {
                            setTimeout(loop2, 0)
                        }
                    })
                })
            };
            setTimeout(loop2, 0)
        };
        setTimeout(loop1, 0)
    };
    RSAKey.prototype.sign = function(text, digestMethod, digestName) {
        var header = getDigestHeader(digestName);
        var digest = header + digestMethod(text).toString();
        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
        if (m == null) {
            return null
        }
        var c = this.doPrivate(m);
        if (c == null) {
            return null
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h
        } else {
            return "0" + h
        }
    };
    RSAKey.prototype.verify = function(text, signature, digestMethod) {
        var c = parseBigInt(signature, 16);
        var m = this.doPublic(c);
        if (m == null) {
            return null
        }
        var unpadded = m.toString(16).replace(/^1f+00/, "");
        var digest = removeDigestHeader(unpadded);
        return digest == digestMethod(text).toString()
    };
    return RSAKey
}());
var JSEncryptRSAKey = (function(_super) {
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        if (key) {
            if (typeof key === "string") {
                _this.parseKey(key)
            } else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) || JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                _this.parsePropertiesFrom(key)
            }
        }
        return _this
    }
    JSEncryptRSAKey.prototype.parseKey = function(pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0]
            }
            if (asn1.sub.length === 9) {
                modulus = asn1.sub[1].getHexStringValue();
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue();
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue();
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue();
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue();
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue();
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue();
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue();
                this.coeff = parseBigInt(coefficient, 16)
            } else if (asn1.sub.length === 2) {
                var bit_string = asn1.sub[1];
                var sequence = bit_string.sub[0];
                modulus = sequence.sub[0].getHexStringValue();
                this.n = parseBigInt(modulus, 16);
                public_exponent = sequence.sub[1].getHexStringValue();
                this.e = parseInt(public_exponent, 16)
            } else {
                return false
            }
            return true
        } catch (ex) {
            return false
        }
    };
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function() {
        var options = {
            array: [new KJUR.asn1.DERInteger({
                int: 0
            }), new KJUR.asn1.DERInteger({
                bigint: this.n
            }), new KJUR.asn1.DERInteger({
                int: this.e
            }), new KJUR.asn1.DERInteger({
                bigint: this.d
            }), new KJUR.asn1.DERInteger({
                bigint: this.p
            }), new KJUR.asn1.DERInteger({
                bigint: this.q
            }), new KJUR.asn1.DERInteger({
                bigint: this.dmp1
            }), new KJUR.asn1.DERInteger({
                bigint: this.dmq1
            }), new KJUR.asn1.DERInteger({
                bigint: this.coeff
            })]
        };
        var seq = new KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex()
    };
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function() {
        return hex2b64(this.getPrivateBaseKey())
    };
    JSEncryptRSAKey.prototype.getPublicBaseKey = function() {
        var first_sequence = new KJUR.asn1.DERSequence({
            array: [new KJUR.asn1.DERObjectIdentifier({
                oid: "1.2.840.113549.1.1.1"
            }), new KJUR.asn1.DERNull()]
        });
        var second_sequence = new KJUR.asn1.DERSequence({
            array: [new KJUR.asn1.DERInteger({
                bigint: this.n
            }), new KJUR.asn1.DERInteger({
                int: this.e
            })]
        });
        var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex()
        });
        var seq = new KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string]
        });
        return seq.getEncodedHex()
    };
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function() {
        return hex2b64(this.getPublicBaseKey())
    };
    JSEncryptRSAKey.wordwrap = function(str, width) {
        width = width || 64;
        if (!str) {
            return str
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n")
    };
    JSEncryptRSAKey.prototype.getPrivateKey = function() {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key
    };
    JSEncryptRSAKey.prototype.getPublicKey = function() {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key
    };
    JSEncryptRSAKey.hasPublicKeyProperty = function(obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") && obj.hasOwnProperty("e"))
    };
    JSEncryptRSAKey.hasPrivateKeyProperty = function(obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") && obj.hasOwnProperty("e") && obj.hasOwnProperty("d") && obj.hasOwnProperty("p") && obj.hasOwnProperty("q") && obj.hasOwnProperty("dmp1") && obj.hasOwnProperty("dmq1") && obj.hasOwnProperty("coeff"))
    };
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function(obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff
        }
    };
    return JSEncryptRSAKey
}(RSAKey));
var JSEncrypt = (function() {
    function JSEncrypt(options) {
        options = options || {};
        this.default_key_size = options.default_key_size ? parseInt(options.default_key_size, 10) : 1024;
        this.default_public_exponent = options.default_public_exponent || "010001";
        this.log = options.log || false;
        this.key = null
    }
    JSEncrypt.prototype.setKey = function(key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.")
        }
        this.key = new JSEncryptRSAKey(key)
    };
    JSEncrypt.prototype.setPrivateKey = function(privkey) {
        this.setKey(privkey)
    };
    JSEncrypt.prototype.setPublicKey = function(pubkey) {
        this.setKey(pubkey)
    };
    JSEncrypt.prototype.decrypt = function(str) {
        try {
            return this.getKey().decrypt(b64tohex(str))
        } catch (ex) {
            return false
        }
    };
    JSEncrypt.prototype.encrypt = function(str) {
        try {
            return hex2b64(this.getKey().encrypt(str))
        } catch (ex) {
            return false
        }
    };
    JSEncrypt.prototype.sign = function(str, digestMethod, digestName) {
        try {
            return hex2b64(this.getKey().sign(str, digestMethod, digestName))
        } catch (ex) {
            return false
        }
    };
    JSEncrypt.prototype.verify = function(str, signature, digestMethod) {
        try {
            return this.getKey().verify(str, b64tohex(signature), digestMethod)
        } catch (ex) {
            return false
        }
    };
    JSEncrypt.prototype.getKey = function(cb) {
        if (!this.key) {
            this.key = new JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return
            }
            this.key.generate(this.default_key_size, this.default_public_exponent)
        }
        return this.key
    };
    JSEncrypt.prototype.getPrivateKey = function() {
        return this.getKey().getPrivateKey()
    };
    JSEncrypt.prototype.getPrivateKeyB64 = function() {
        return this.getKey().getPrivateBaseKeyB64()
    };
    JSEncrypt.prototype.getPublicKey = function() {
        return this.getKey().getPublicKey()
    };
    JSEncrypt.prototype.getPublicKeyB64 = function() {
        return this.getKey().getPublicBaseKeyB64()
    };
    return JSEncrypt
}());
encrypt = function(t) {
    var e = new JSEncrypt();
    return e.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrWVnSOu9m7O8X3taQGXzVlB9B0Gw1Mvbc0MxKZOxT8SlQVB1Krpu3KfuoxgGE1TikX/JkYJf+D4tTqENqk5pnSZc784gWZPEs2O+uz5R/8Ay8qP06uHDzw1oGDrpo8wxWQ7Ae2IwE2gTDtpcyg8NUJp14uYwsvA47iDpXHGmPxQIDAQAB-----END PUBLIC KEY-----");
    pwd = e.encrypt(t);
    return pwd
}