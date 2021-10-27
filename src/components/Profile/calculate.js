/*
 * @Author: your name
 * @Date: 2021-09-23 15:58:45
 * @LastEditTime: 2021-09-26 18:36:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\Profile\calculate.js
 */
//栈结构
function Stack(){
    let items = []

    this.push = function (element) {
      items.push(element)
    }
    this.pop = function () {
      return items.pop()
    }
    this.peek = function () {
      return items[items.length - 1]
    }
    this.isEmpty = function () {
      return items.length === 0
    }
    this.size = function () {
      return items.length
    }
    this.clear = function () {
      items = []
    }
    this.print = function () {
      console.log(items.toString())
    }
}
//优先级设置
function getLevel(str){
    let level;
    switch(str){
        case '*': level = 5; break;
        case '/': level = 5; break;
        case '+': level = 4; break;
        case '-': level = 4; break;
        default: level = 0; break;
    }
    return level;
}
//中缀转后缀
function ITransferS(str){
    let stack = new Stack();
    let list = [];
    let numStr = '';
    for(let i = 0; i < str.length; i++){
        // 只要是数字直接缓存区
        if (/^[0-9]*$/.test(str[i]) || /^[.]*$/.test(str[i])) {
            // list.push(str[i])
            numStr += str[i]
        } else if (str.charAt(i) === '+' || str.charAt(i) === '-' || str.charAt(i) === '*' || str.charAt(i) === '/') {
            numStr !== '' && list.push(numStr);
            numStr = '';
            while (true) {
            if (stack.isEmpty() || stack.peek() === '(') {
                stack.push(str[i])
                break
            } else if (getLevel(str[i]) > getLevel(stack.peek())) {		//当前运算符优先级大于s1栈顶运算符优先级 
                stack.push(str[i]);
                break;
            }
            else {								//小于等于 
                let cc = stack.peek();
                stack.pop();
                list.push(cc);
            }
            }
      } else {
        numStr !== '' && list.push(numStr);
        numStr = ''
        if (str.charAt(i) === '(') {
          stack.push(str[i]);
        } else {
          while (stack.peek() !== '(') {
            let ccc = stack.peek();
            stack.pop();
            list.push(ccc);
          }
          stack.pop()
        }
      }
    }

    // 将剩下的全部追加在后面
    while (!stack.isEmpty()) {
        // debugger
        // console.log(str, 'init')
        //判断numStr是否有剩余
        if(numStr.length > 0 && numStr !== ''){
            list.push(numStr)
            numStr = ''
        }
        let cccc = stack.peek();
        list.push(cccc);
        stack.pop();
    }
    return list
}

function Calculate(str){
    let tokens = ITransferS(str);
    // console.log(tokens, 'tokens')
    let cal = {
		'+': (b, a) => Number(a) + Number(b),
		'-': (b, a) => a - b,
		'*': (b, a) => a * b,
		'/': (b, a) => parseInt(a / b)
	}
	let stack = [];
	tokens.forEach(n => stack.push(isNaN(n) ? cal[n](stack.pop(), stack.pop()) : n));
	return stack.pop();
}

export default Calculate;