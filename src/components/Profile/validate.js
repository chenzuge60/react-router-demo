/*
 * @Author: your name
 * @Date: 2021-09-23 15:11:59
 * @LastEditTime: 2021-09-26 20:41:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\Profile\validate.js
 */
function Validate(
        string,
        // obj
    ){
    // 剔除空白符
    string = string.replace(/\s/g, '');

    // 错误情况，空字符串
    if ("" === string) {
        return false;
    }
    //错误情况，运算符开头
    // eslint-disable-next-line no-useless-escape
    if (/^[\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; 运算符开头 & amp; quot;);
        return false;
    }

    //错误情况，运算符结尾
    // eslint-disable-next-line no-useless-escape
    if (/[\+\-\*\/]$/.test(string)) {
        // console.error(& amp; quot; 运算符结尾 & amp; quot;);
        return false;
    }

    // 错误情况，(后面是运算符或者)
    // eslint-disable-next-line no-useless-escape
    if (/\([\+\-\*\/]/.test(string)) {
        // console.error(& amp; quot; (后面是运算符或者) & amp; quot;);
        return false;
    }
    // 错误情况，运算符连续
    // eslint-disable-next-line no-useless-escape
    if (/[\+\-\*\/]{2,}/.test(string)) {
        return false;
    }

    // 空括号
    if (/\(\)/.test(string)) {
        return false;
    }

    // 错误情况，括号不配对
    var stack = [];
    for (var i = 0, item; i < string.length; i++) {
        item = string.charAt(i);
        if ('(' === item) {
            stack.push('(');
        } else if (')' === item) {
            if (stack.length > 0) {
                stack.pop();
            } else {
                return false;
            }
        }
    }

    if (0 !== stack.length) {
        return false;
    }

    // 错误情况，(后面是运算符
    // eslint-disable-next-line no-useless-escape
    if (/\([\+\-\*\/]/.test(string)) {
        return false;
    }

    // 错误情况，)前面是运算符
    // eslint-disable-next-line no-useless-escape
    if (/[\+\-\*\/]\)/.test(string)) {
        return false;
    }

    // 错误情况，(前面不是运算符
    // if (/[\+\-\*\/]\(/.test(string)) {
    //     return false;
    // }

    // 错误情况，)后面不是运算符
    // if (/\)[\+\-\*\/]/.test(string)) {
    //     return false;
    // }

    // 错误情况，变量没有来自“待选公式变量”
    // var tmpStr = string.replace(/[\(\)\+\-\*\/]{1,}/g, ',');
    // var array = tmpStr.split(',');
    // for (let i = 0, item; i < array.length; i++) {
    //     item = array[i];
    //     if (/[A-Z]/i.test(item) && 'undefined' == typeof (obj[item])) {
    //         return false;
    //     }
    // }
    // let stringarr = string.split(',');
    // let objarr = Object.keys(obj);
    // for (let index = 0; index < stringarr.length; index++) {
    //     if (objarr.indexOf(stringarr[index]) > -1) {
    //         if (stringarr[index + 1]==undefined){
    //         } else if (stringarr[index + 1] !== '+' && stringarr[index + 1] !== '.' && stringarr[index + 1] !== '-' && stringarr[index + 1] !== 'x' && stringarr[index + 1] !== '÷' && stringarr[index + 1] !== '(' && stringarr[index + 1] !== ')'){
    //                 return false 
    //         } 
    //     }
        
    // }

    return true;
}

export default Validate;