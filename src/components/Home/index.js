/*
 * @Author: your name
 * @Date: 2021-03-25 17:20:13
 * @LastEditTime: 2021-09-14 10:41:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\Home\index.js
 */
import React, { Component } from 'react';
import CanvasDemo from '../gridCom/canvasDemo';
import { InputNumber } from 'antd';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            number: 10
         }
    }

    transform(value){
        this.setState({number: value})
    }

    render() { 
        return ( 
            <div>
                <div>canvasDemo</div>
                <InputNumber defaultValue={10} onStep={(value) => this.transform(value)}/>
                <CanvasDemo num={this.state.number}/>
            </div>
         );
    }
}
 
export default Home;