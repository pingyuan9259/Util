const eventEmitter = require('event-emitter');
const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
module.exports = {
    events: eventEmitter({}),
    match: {
        mobile: {
            reg: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
            msg: '请正确填写您的手机号码'
        },
        tel: {
            reg: /^(\d{3,4}-?)?\d{7,9}$/g,
            mag: '请正确填写您的电话号码'
        },
        textArea: {
            reg: /^([?!,.*\n\w\u4e00-\u9fa5\u3000-\u301e\ufe10-\ufe19\ufe30-\ufe44\ufe50-\ufe6b\uff01-\uffee]{0,20})$/,
            msg: '请输入不超过200个字符'
        },
        idCard: {
            reg: /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/,
            msg: '请正确填写您的身份证号码'
        }
    },
    //wxbjiami
    base64encode: function(str){
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if(i === len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if(i === len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    //pingyuan
    objToUrlString: function(url, obj) {
        if(typeof obj === 'object' || !obj) {
            let string = '?';
            if (url.indexOf('&') !== -1) {
                string = '&';
            }
            for (let props in obj) {
                let params = props + '=' + obj[props] + '&';
                string += params;
            }
            string = string.substring(0, string.length-1);
            return url + string;
        } else {
            console.log("util.objToUrlString需要传入对象(一维)类型参数");
        }
    },
    getLocalTime: function(time, type) {
        let date = new Date(parseInt(time));
        let Y = date.getFullYear() + '年';
        let M = (date.getMonth() + 1) + '月';
        let D = date.getDate() + '日';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds(); 
        switch (type) {
            case 'date':
                return Y + M + D;
            case 'time':
                return h + m + s;
            case 'dateTime':
                return Y + M + D + ' ' + ' ' + h + m + s;
        }
    },
    contains: function( a, b ) { //from jquery.contains
        if ( b ) {
            while ( (b = b.parentNode) ) {
                if ( b === a ) {
                    return true;
                }
            }
        }
        return false;
    },
    getRequest: function(url, data) {
        var fullUrl = this.objToUrlString(url, data);
        return fetch(fullUrl, {
            headers: {
                "x-csrf-token": scoreweb.token
            },
            credentials: 'include' //使用cookie  默认不使用cookie
        });
    },
    postRequest: function(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01', //接受数据格式
                'Content-Type': 'application/json; charset=UTF-8', //请求数据格式
                "x-csrf-token": scoreweb.token
            },
            credentials: 'include', //使用cookie  默认不使用cookie
            body: JSON.stringify(data)
        })
    },
    //hash
    getHash: function(url){
        return url.substring((url.indexOf("#") + 1), url.length);
    }
};