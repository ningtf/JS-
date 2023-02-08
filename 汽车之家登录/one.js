var geetest_challenge = "";
var geetest_seccode = "";
var geetest_validate = "";
var geetestresult = null;
var geetecaptchaObj = null;

var geetest_challenge2 = "";
var geetest_seccode2 = "";
var geetest_validate2 = "";
var geetestresult2 = null;
var geetecaptchaObj2 = null;

var qrCodeScan = true;

(function($) {
    var handlerEmbed = function(captchaObj) {
        captchaObj.appendTo("#embed-captcha");
        captchaObj.onReady(function() {
            $("#wait")[0].style.display = "none";
        });
        captchaObj.onSuccess(function() {
            geetecaptchaObj = captchaObj;
            geetestresult = captchaObj.getValidate();
            if (geetestresult) {
                geetest_challenge = geetestresult.geetest_challenge;
                geetest_seccode = geetestresult.geetest_seccode;
                geetest_validate = geetestresult.geetest_validate;

                //校验通过显示安全发送按钮
                var cssName = $("#aGetphoneno").css("display");
                if (cssName == "none") {
                    $("#aGetphoneno").show();
                    $("#spmsg").hide();
                }
            }
        });
    };
    var handlerEmbed2 = function(captchaObj) {
        captchaObj.appendTo("#embed-captcha2");
        captchaObj.onReady(function() {
            $("#wait2")[0].style.display = "none";
        });
        captchaObj.onSuccess(function() {
            geetecaptchaObj2 = captchaObj;
            geetestresult2 = captchaObj.getValidate();
            if (geetestresult2) {
                geetest_challenge2 = geetestresult2.geetest_challenge;
                geetest_seccode2 = geetestresult2.geetest_seccode;
                geetest_validate2 = geetestresult2.geetest_validate;
            }
        });
    };
    $.ajax({
        url: "/AccountApi/GetCaptcha?site=web&t=" + (new Date()).getTime(),
        type: "get",
        dataType: "json",
        // 使用jsonp格式
        success: function(data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: "embed",
                // 产品形式
                offline: !data.success,
                width: '100%',
                height: "38px"
            }, handlerEmbed);
        }
    });
    $.ajax({
        url: "/AccountApi/GetCaptcha?site=web&t=" + (new Date()).getTime(),
        type: "get",
        dataType: "json",
        // 使用jsonp格式
        success: function(data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: "embed",
                // 产品形式
                offline: !data.success,
                width: '100%',
                height: "38px"
            }, handlerEmbed2);
        }
    });

    var qrCode = {
        init: function() {
            qrCodeScan = true;
            $("#qrcodeImg").attr("src", "/Login/GetLoginQrCode?id=" + Math.random());
            $("#invalid-tips").hide();
        },
        setInterval: function() {
            var interval = setInterval(function() {
                qrCode.scanQrState();
            }, 2 * 1000);
        },
        scanQrState: function() {
            if (qrCodeScan) {
                $.ajax({
                    url: "/Login/GetQRState",
                    data: {
                        fPosition: fPosition,
                        sPosition: sPosition,
                        platform: platform,
                        popWindow: popWindow
                    },
                    type: "get",
                    dataType: "json",
                    cache: false,
                    success: function(o) {
                        if (o.returncode == 0) {
                            if (o.result.Status == 2) {
                                $(".qr-code").addClass("fn-hide");
                                $(".qr-code-success").removeClass("fn-hide");
                            } else if (o.result.Status == 4) {
                                qrCodeScan = false;
                                $(".qr-code").removeClass("fn-hide");
                                $(".qr-code-success").addClass("fn-hide");
                                $("#invalid-tips").show();
                            } else if (o.result.Status == 3) {
                                qrCodeScan = false;
                                JsLoad(o.LoginUrl, 1);
                                JsLoad(o.ssoAutohomeUrl, 2);
                                var upStreamTimer = setInterval(function() {

                                    if (result2 && !result4) {
                                        result4 = true;
                                        JsLoad(o.loginUrlJiaJiaBX, 3);
                                    }
                                    if ((result1 && result2 && result3)) {
                                        clearInterval(upStreamTimer);
                                        if (o.Msg == 'Msg.ChangePassword') {
                                            parent.location.href = "//i.autohome.com.cn/setting/password";
                                            return;
                                        }
                                        if (o.Msg == 'Msg.NoBindMobile') {

                                            parent.location.href = "//account.autohome.com.cn/login/UserBindMobile?bindbackurl=" + encodeURIComponent(parent.location.href);
                                            return;
                                        }
                                        if (o.Msg == 'Msg.Ip3') {

                                            parent.location.href = "//account.autohome.com.cn/Dubious/index?bindbackurl=" + encodeURIComponent(parent.location.href);
                                            return;
                                        }
                                        //parent.closeAccountPop(0);
                                        closeDialog();
                                        popCallBackFun();
                                        /*回跳函数*/
                                        setCookie("_SYLMM", "");
                                        result1 = false;
                                        result2 = false;
                                        result3 = false;
                                        result4 = false;
                                    }
                                }, 1000);
                            }
                        }
                    }
                });
            }
        }
    }
    qrCode.init();
    qrCode.setInterval();
    $("#refreshQrCode").click(function() {
        qrCode.init();
    });
})(jQuery)

/*===============浮层登录===============*/
var Msg = {
    UserNameNull: "账号不能为空",
    PassWordNull: "密码不能为空",
    AccountError: "帐号或密码错误，请点击上方忘记密码找回。",
    ValidateCodeNull: "验证码不能为空",
    ValidateCodeLengthError: "验证码不正确",
    ValidFaile: "滑动验证失败，请重试",
    UserNameNoFind: "账号不存在",
    Success: ""
};

var result1 = false;
var result2 = false;
var result3 = false;
var result4 = false;
var logincount = 0;
var registerUrlParm = "fPosition=" + fPosition + "&sPosition=" + sPosition + "&platform=" + platform + "&popWindow=" + popWindow;
var registerUrl = "//account.autohome.com.cn/register";

function PopLogin(registerType, backurl) {
    if (backurl == undefined || backurl == '' || backurl == 'undefined') {
        try {
            backurl = parent.window.location.href;
        } catch (e) {}
    }
    registerUrl += "?rt=" + registerType + "&backurl=" + backurl + "&" + registerUrlParm;

    $("#account_pop_loginSubmit").click(function(evt) {
        login();
        /*IE6 hack  */
        evt.preventDefault();
    })

    $("#account_pop_loginPwd").keydown(function(e) {
        e = e || window.event;
        if (e.keyCode == 13) {
            login();
            /*IE6 hack  */
            e.preventDefault();
        }
    });

    var uc = 0;
    var pc = 0;
    $("#account_pop_loginPwd").keyup(function() {
        pc = pc + 1;
        var ul = 0;
        var pl = 0;
        if ($("#account_pop_loginName").val() != undefined) ul = $("#account_pop_loginName").val().replace("请输入手机号/邮箱/用户名", "").length;
        if ($("#account_pop_loginPwd").val() != undefined) pl = $("#account_pop_loginPwd").val().length;
        setCookie("_SYLMM", uc + "-" + ul + "-" + pc + "-" + pl);
    });

    $("#account_pop_loginName").keyup(function() {
        uc = uc + 1;
        var ul = 0;
        var pl = 0;
        if ($("#account_pop_loginName").val() != undefined) ul = $("#account_pop_loginName").val().replace("请输入手机号/邮箱/用户名", "").length;
        if ($("#account_pop_loginPwd").val() != undefined) pl = $("#account_pop_loginPwd").val().length;
        setCookie("_SYLMM", uc + "-" + ul + "-" + pc + "-" + pl);
    });

    function setCookie(name, value) {
        document.cookie = name + "=" + escape(value) + ";path=/";
    }

    $("#weibologin").click(function() {
        parent.location.href = "//account.autohome.com.cn/oauth/sinaoauth?t=Index&rt=" + registerType + "&" + registerUrlParm + "&backurl=" + backurl;
    });
    $("#qqlogin").click(function() {
        parent.location.href = "//account.autohome.com.cn/oauth/tencentoauth?t=Index&rt=" + registerType + "&" + registerUrlParm + "&backurl=" + backurl;
    });
    $("#weixinlogin").click(function() {
        parent.location.href = "//account.autohome.com.cn/oauth/weixinoauth?t=Index&rt=" + registerType + "&" + registerUrlParm + "&backurl=" + backurl;
    });
    $("#yizhangtong").click(function() {
        parent.location.href = "//account.autohome.com.cn/oauth/pinganoauth?t=Index&" + registerUrlParm + "&backurl=" + backurl;
    });

    $("#account_pop_link_close").click(function() {
        closeDialog();
    });

    $("#account_pop_loginName").focus(function() {
        nameFocus();
    });
}

function nameFocus() {
    if (document.getElementById('account_pop_loginName').value == '请输入手机号/邮箱/用户名') {
        document.getElementById('account_pop_loginName').value = '';
    }
}

function JsLoad(args, result) {
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', args);
    s.id = "tempscript" + result;
    s.onload = s.onreadystatechange = function() {
        if (!IsIE()) {
            //火狐
            if ((document.readyState == 'loaded' || document.readyState == 'complete')) {
                if (result == 1) {
                    result1 = true;
                } else if (result == 2) {
                    result2 = true;
                } else {
                    result3 = true;
                }
                try {
                    s.parentNode.removeChild(s);
                } catch (e) {};
            }
        } else {
            //IE
            if ((this.readyState == 'loaded' || this.readyState == 'complete')) {
                if (result == 1) {
                    result1 = true;
                } else if (result == 2) {
                    result2 = true;
                } else {
                    result3 = true;
                }
                try {
                    s.parentNode.removeChild(s);
                } catch (e) {};
            }
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
    return result;
};

function IsIE() {
    if (navigator.appName === 'Microsoft Internet Explorer') {
        return true;
    }
    //忽略IE11，IE11内核已经和其他浏览器一样
    //else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {// IE 11
    //    return true;
    //}
    return false;
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/, '');
    }
}

/*账密登录*/
var pwdisclick = false;

function login() {
    if (pwdisclick) return;
    nameFocus();
    var userName = document.getElementById("account_pop_loginName").value.trim();
    var pwd = document.getElementById("account_pop_loginPwd").value;
    var isauto = $("#account_pop_loginIsSave").is(":checked");
    pwdisclick = true;
    //检查是否勾选政策 隐私条款
    var isagree = $("#check_submitpwd").is(':checked');
    if (!isagree) {
        pwdSubmitErrorInfo("请勾选使用协议和隐私政策");
        return false;
    }
    if (userName == "") {
        userNameFail("账号不能为空");
        return;
    }
    if (pwd == "") {
        pwdFail("密码不能为空");
        return;
    }
    if (pwd.length < 6 || pwd.length > 40) {
        pwdFail("密码错误");
        return;
    }
    if (geetecaptchaObj2 == null) {
        pwdSubmitErrorInfo("请先进行滑动验证");
        return;
    }
    $("#account_pop_loginSubmit").html("登录中...");
    $.post("//account.autohome.com.cn/Login/ValidIndex", {
        loginfrom: "poplogin",
        name: escape(userName),
        pwd: hex_md5(pwd),
        isauto: isauto,
        fPosition: fPosition,
        sPosition: sPosition,
        platform: platform,
        popWindow: popWindow,
        geetest_challenge: geetest_challenge2,
        geetest_seccode: geetest_seccode2,
        geetest_validate: geetest_validate2
    }, function(json) {
        resetgeetecaptcha(2);
        var o;
        try {
            o = eval("(" + json + ")");
        } catch (err) {
            pwdFail("ip异常，请联系客服");
            $("#account_pop_loginSubmit").html("登 录");
            return;
        }
        if (o == undefined) {
            pwdFail("系统出了问题，请联系客服！");
            $("#account_pop_loginSubmit").html("登 录");
            return;
        }
        if (o.success == 0) {
            if (o.Msg == 'Msg.ValidFaile') {
                pwdSubmitErrorInfo(eval(o.Msg));
                $("#account_pop_loginSubmit").html("登 录");
                return;
            }
            if (o.RedUser != undefined) {
                pwdFail("帐号或密码错误，请点击忘记密码找回。");
            } else {
                pwdFail("账号或密码错误");
            }
            $("#account_pop_loginSubmit").html("登 录");
        } else {
            JsLoad(o.LoginUrl, 1);
            JsLoad(o.ssoAutohomeUrl, 2);
            //JsLoad(o.ssoChe168Url, 3)

            var upStreamTimer = setInterval(function() {

                if (result2 && !result4) {
                    result4 = true;
                    JsLoad(o.loginUrlJiaJiaBX, 3);
                }

                if ((result1 && result2 && result3)) {
                    clearInterval(upStreamTimer);
                    if (o.Msg == 'Msg.ChangePassword') {
                        parent.location.href = "//i.autohome.com.cn/setting/password";
                        return;
                    }
                    if (o.Msg == 'Msg.NoBindMobile') {

                        parent.location.href = "//account.autohome.com.cn/login/UserBindMobile?bindbackurl=" + encodeURIComponent(parent.location.href);
                        return;
                    }
                    if (o.Msg == 'Msg.Ip3') {

                        parent.location.href = "//account.autohome.com.cn/Dubious/index?bindbackurl=" + encodeURIComponent(parent.location.href);
                        return;
                    }
                    //parent.closeAccountPop(0);
                    closeDialog();
                    popCallBackFun();
                    /*回跳函数*/
                    setCookie("_SYLMM", "");
                    result1 = false;
                    result2 = false;
                    result3 = false;
                    result4 = false;
                }
            }, 1000);
        }
    });
}

function pwdSubmitErrorInfo(msg) {
    pwdisclick = false;
    if (msg != "") {
        $('#pwdmsg').html("");
        $('#pwdmsg').html(msg);
        $('#pwdmsg').removeClass("tip-hide");
    }
}

function pwdFail(msg) {
    pwdisclick = false;
    $("#account_pop_loginPwd").focus();
    $('#pwdmsg').html("");
    $('#pwdmsg').html(msg);
    $('#pwdmsg').removeClass("tip-hide");
    //parent.SetPopLoginHeight(document.body.clientHeight);
}

function userNameFail(msg) {
    pwdisclick = false;
    $("#account_pop_loginName").focus();
    $('#pwdmsg').html("");
    $('#pwdmsg').html(msg);
    $('#pwdmsg').removeClass("tip-hide");
    //parent.SetPopLoginHeight(document.body.clientHeight);
}
var urlParams = getUrlquery();
//关闭弹层
function closeDialog() {
    if (top == self) {
        return;
    }
    if (urlParams('new_mode')) {
        parent.athmLoginPop_onClose && parent.athmLoginPop_onClose();
    } else {
        parent.closeAccountPop && parent.closeAccountPop();
    }
}

function popCallBackFun() {
    if (urlParams('new_mode')) {
        parent.athmLoginPop_onLoginSuccess && parent.athmLoginPop_onLoginSuccess();
    } else {
        parent.callBackFunAccountPopLogin && parent.callBackFunAccountPopLogin();
    }
}

var sendagainno = 60;
var isclick = false;
$("#aGetphoneno").click(function() {
    if (isclick) {
        return;
    }
    if (geetecaptchaObj == null) {
        ErroInfo("请先进行滑动验证");
        return false;
    }
    isclick = true;
    var phoneno = $("#phoneno");
    if (phoneno.val() == "") {
        ErroInfo("请填写手机号");
        phoneno.focus();
        isclick = false;
        return false;
    } else {
        if (!checkPhone(phoneno.val())) {
            ErroInfo("手机号格式不正确");
            phoneno.focus();
            isclick = false;
            return false;
        };
    }
    $.ajax({
        type: "Post",
        data: {
            phoneno: phoneno.val(),
            geetest_challenge: geetest_challenge,
            geetest_seccode: geetest_seccode,
            geetest_validate: geetest_validate
        },
        url: "/Login/SendRegLoginMobileCode",
        dataType: "json",
        success: function(data) {
            var result = eval(data);
            if (result == undefined) {
                ErroInfo('系统出了问题，请联系客服！');
            }
            if (result.success == 0) {
                $("#aGetphoneno").hide();
                $("#spmsg").show();
                ErroInfo("验证码已发送");
                sendagin();
                return;
            }
            if (result.Msg == "Msg.MobileNotExist") {
                ErroInfo("手机号或验证码不存在");
                isclick = false;
                return;
            }
            if (result.Msg == "Msg.PhoneBlacklist") {
                ErroInfo("手机号已经加入黑名单，请返回账号登录");
                isclick = false;
                return;
            } else {
                ErroInfo("动态密码发送失败，请稍后再试");
                isclick = false;
                return;
            }
        }
    })
    isclick = false;
});

function changeAstate() {
    $("#aGetphoneno").show();
    $("#spmsg").hide();
}

function sendagin() {
    if (sendagainno == 0) {
        changeAstate();
        sendagainno = 60;
        isclick = false;
    } else {
        $("#aGetphoneno").hide();
        $("#spmsg").show();
        $("#spmsg").html("重新发送(" + sendagainno + "s)");
        sendagainno--;
        setTimeout(function() {
            sendagin()
        }, 1000);
    }
}

function rediectRegUrl() {
    parent.location.href = registerUrl;
}

var isSubmit = false;
$("#SubmitPhoneLogin").click(function() {
    if (isSubmit) {
        return;
    }
    var phoneno = $("#phoneno");
    var code = $("#phonecode");
    isSubmit = true;

    //检查是否勾选政策 隐私条款
    var isagree = $("#check_submitphone").is(':checked');
    if (!isagree) {
        ErroInfo("请勾选使用协议和隐私政策");
        isSubmit = false;
        return false;
    }
    if (phoneno.val() == "") {
        ErroInfo("请填写手机号");
        phoneno.focus();
        isSubmit = false;
        return false;
    } else {
        if (!checkPhone(phoneno.val())) {
            ErroInfo("手机号格式不正确");
            phoneno.focus();
            isSubmit = false;
            return false;
        };
    }
    if (geetecaptchaObj == null) {
        ErroInfo("请先进行滑动验证");
        isSubmit = false;
        return false;
    }
    if (code.val() == "") {
        ErroInfo("请输入短信验证码");
        code.focus();
        isSubmit = false;
        return false;
    }
    $("#SubmitPhoneLogin").text("登录中...");
    $.ajax({
        type: "Post",
        data: {
            phoneno: phoneno.val(),
            phonecode: code.val(),
            fPosition: fPosition,
            sPosition: sPosition,
            platform: platform,
            popWindow: popWindow
        },
        url: "RegOrLoginByMobileCode",
        dataType: "json",
        success: function(data) {
            //重置滑动验证
            resetgeetecaptcha(1);
            var result = eval(data);
            if (result == undefined) {
                ErroInfo('系统出了问题，请联系客服！');
                $("#SubmitPhoneLogin").text("登 录");
                isSubmit = false;
                return;
            }
            if (result.success == 1) {
                JsLoad(result.LoginUrl, 1);
                JsLoad(result.ssoAutohomeUrl, 2);
                //JsLoad(o.ssoChe168Url, 3)

                var upStreamTimer = setInterval(function() {

                    if (result2 && !result4) {
                        result4 = true;
                        //JsLoad(result.ssoChe168Url, 3);
                        JsLoad(result.loginUrlJiaJiaBX, 3);
                    }

                    if ((result1 && result2 && result3)) {
                        clearInterval(upStreamTimer);
                        if (result.Msg == 'Msg.ChangePassword') {
                            parent.location.href = "//i.autohome.com.cn/setting/password";
                            return;
                        }
                        //parent.closeAccountPop(0);
                        closeDialog();
                        popCallBackFun();
                        /*回跳函数*/
                        setCookie("_SYLMM", "");
                        result1 = false;
                        result2 = false;
                        result3 = false;
                        result4 = false;
                    }
                }, 1000);
            } else {
                if (result.Msg == "Msg.MobileNotExist") {
                    ErroInfo("手机号或验证码不存在");
                } else {
                    ErroInfo(result.Msg);
                }
                isSubmit = false;
                $("#SubmitPhoneLogin").text("登 录");
            }

        }
    })
    isSubmit = false;
})
//手机号登录隐私政策勾选隐藏提示
$("#check_submitphone").change(function() {
    var agree = $("#check_submitphone").is(':checked');
    var msg = $('#phonemsg').text();
    if (agree && msg == "请勾选使用协议和隐私政策") {
        $('#phonemsg').text("");
    }
});
$("#check_submitpwd").change(function() {
    var agree = $("#check_submitpwd").is(':checked');
    var msg = $('#pwdmsg').text();
    if (agree && msg == "请勾选使用协议和隐私政策") {
        $('#pwdmsg').text("");
    }
});

function checkPhone(phone) {
    if (phone == "" || phone == null || phone == undefined || phone == "undefined") {
        return false;
    }
    var reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    if (!reg.test(phone)) {
        return false;
    }
    return true;
}

function ErroInfo(msg) {
    if (msg != "") {
        $('#phonemsg').html("");
        $('#phonemsg').html(msg);
        $('#phonemsg').removeClass("tip-hide");
    }
}

function hideErroInfo() {
    $('#phonemsg').html("");
}

function resetgeetecaptcha(type) {
    if (type == 1) {
        if (geetecaptchaObj != null) {
            geetecaptchaObj.reset();
            geetecaptchaObj = null;
        }
    } else {
        if (geetecaptchaObj2 != null) {
            geetecaptchaObj2.reset();
            geetecaptchaObj2 = null;
        }
    }
}

function getUrlquery() {
    var queryObj = {};
    var query = window.location.href.split('?')[1];
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        queryObj[pair[0]] = pair[1];
    }
    return function(key) {
        return queryObj[key];
    };
}

// JavaScript Document
var hexcase = 0;
/* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = "";
/* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8;
/* bits per input character. 8 - ASCII; 16 - Unicode      */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}

function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
}

function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
}
/* Backwards compatibility - same as hex_md5() */
function calcMD5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}
/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
    }
    return str;
}
/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx　 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx　10xx xxxx　10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
};
(function(name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    } else {
        context[name] = definition();
    }
})('AutoPc', this, function() {
    'use strict';

    var AutoPc = function(options) {
        var nativeForEach, nativeMap;
        nativeForEach = Array.prototype.forEach;
        nativeMap = Array.prototype.map;

        this.each = function(obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        };

        this.map = function(obj, iterator, context) {
            var results = [];
            // Not using strict equality so that this acts as a
            // shortcut to checking for `null` and `undefined`.
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };

        if (typeof options == 'object') {
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if (typeof options == 'function') {
            this.hasher = options;
        }
    };

    AutoPc.prototype = {
        get: function() {
            var keys = [];
            keys.push(navigator.userAgent);
            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            if (this.screen_resolution) {
                var resolution = this.getScreenResolution();
                if (typeof resolution !== 'undefined') {
                    // headless browsers, such as phantomjs
                    keys.push(this.getScreenResolution().join('x'));
                }
            }
            keys.push(new Date().getTimezoneOffset());
            keys.push(this.hasSessionStorage());
            keys.push(this.hasLocalStorage());
            keys.push( !! window.indexedDB);
            //body might not be defined at this point or removed programmatically
            if (document.body) {
                keys.push(typeof(document.body.addBehavior));
            } else {
                keys.push(typeof undefined);
            }
            keys.push(typeof(window.openDatabase));
            keys.push(navigator.cpuClass);
            keys.push(navigator.platform);
            keys.push(navigator.doNotTrack);
            keys.push(this.getPluginsString());
            if (this.canvas && this.isCanvasSupported()) {
                keys.push(this.getCanvasFingerprint());
            }
            if (this.hasher) {
                return this.hasher(keys.join('###'), 31);
            } else {
                return this.murmurhash3_32_gc(keys.join('###'), 31);
            }
        },

        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;

            remainder = key.length & 3;
            // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;

            while (i < bytes) {
                k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
                ++i;

                k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
            }

            k1 = 0;

            switch (remainder) {
                case 3:
                    k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                case 2:
                    k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                case 1:
                    k1 ^= (key.charCodeAt(i) & 0xff);

                    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                    h1 ^= k1;
            }

            h1 ^= key.length;

            h1 ^= h1 >>> 16;
            h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= h1 >>> 13;
            h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= h1 >>> 16;

            return h1 >>> 0;
        },

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        hasLocalStorage: function() {
            try {
                return !!window.localStorage;
            } catch (e) {
                return true;
                // SecurityError when referencing it means it exists
            }
        },

        hasSessionStorage: function() {
            try {
                return !!window.sessionStorage;
            } catch (e) {
                return true;
                // SecurityError when referencing it means it exists
            }
        },

        isCanvasSupported: function() {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        isIE: function() {
            if (navigator.appName === 'Microsoft Internet Explorer') {
                return true;
            } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {
                // IE 11
                return true;
            }
            return false;
        },

        getPluginsString: function() {
            if (this.isIE()) {
                return this.getIEPluginsString();
            } else {
                return this.getRegularPluginsString();
            }
        },

        getRegularPluginsString: function() {
            return this.map(navigator.plugins, function(p) {
                var mimeTypes = this.map(p, function(mt) {
                    return [mt.type, mt.suffixes].join('~');
                }).join(',');
                return [p.name, p.description, mimeTypes].join('::');
            }, this).join(';');
        },

        getIEPluginsString: function() {
            if (window.ActiveXObject) {
                var names = ['ShockwaveFlash.ShockwaveFlash', //flash plugin
                'AcroPDF.PDF', // Adobe PDF reader 7+
                'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                'QuickTime.QuickTime', // QuickTime
                // 5 versions of real players
                'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)', 'RealPlayer', 'SWCtl.SWCtl', // ShockWave player
                'WMPlayer.OCX', // Windows media player
                'AgControl.AgControl', // Silverlight
                'Skype.Detection'];

                // starting to detect plugins in IE
                return this.map(names, function(name) {
                    try {
                        var activeObject = new ActiveXObject(name);
                        if (activeObject != null && activeObject != undefined && name == 'ShockwaveFlash.ShockwaveFlash') return name + activeObject.GetVariable("$version");
                        return name;
                    } catch (e) {
                        return null;
                    }
                }).join(';');
            } else {
                return "";
                // behavior prior version 0.5.0, not breaking backwards compat.
            }
        },

        getScreenResolution: function() {
            return [screen.height, screen.width];
        },

        getCanvasFingerprint: function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            try {
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.fillText(txt, 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText(txt, 4, 17);
            } catch (e) {}
            return canvas.toDataURL();
        }
    };

    return AutoPc;

});

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    //document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    document.cookie = name + "=" + escape(value);
}

window.onload = function() {
    var autoPc = new AutoPc({
        canvas: true,
        screen_resolution: true
    }).get();
    setCookie('_ILMD', autoPc);
};


function getpwd(pwd) {
    pwd = hex_md5(pwd)
    return pwd
};