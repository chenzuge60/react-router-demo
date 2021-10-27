/*
 * @Author: your name
 * @Date: 2021-09-14 09:53:32
 * @LastEditTime: 2021-09-14 10:53:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\gridCom\canvasDemo.js
 */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasStyle = styled.div`
    border: 1px solid #cccccc;
    margin-top: 100px;
    margin-left: 100px;
    width: 400px;
    height: 400px;
`

function draw(ctx, gridSize){
    let CanvasWidth = ctx.canvas.width;
    let CanvasHeight = ctx.canvas.height;

    var xLineTotals = Math.floor(CanvasHeight / gridSize);
    for (var i = 0; i < xLineTotals; i++) {
        ctx.beginPath(); // 开启路径，设置不同的样式
        ctx.moveTo(0, gridSize * i - 0.5); // -0.5是为了解决像素模糊问题
        ctx.lineTo(CanvasWidth, gridSize * i - 0.5);
        ctx.strokeStyle = "#ccc"; // 设置每个线条的颜色
        ctx.stroke();
    }

    var yLineTotals = Math.floor(CanvasWidth / gridSize); // 计算需要绘画y轴的条数
    for (var j = 0; j < yLineTotals; j++) {
        ctx.beginPath(); // 开启路径，设置不同的样式
        ctx.moveTo(gridSize * j, 0);
        ctx.lineTo(gridSize * j, CanvasHeight);
        ctx.strokeStyle = "#ccc"; // 设置每个线条的颜色
        ctx.stroke();
    }
}

function CanvasDemo(props){
    const { num } = props;
    const [number, setNum] = useState(num);
    let canvasEl = useRef(null);

    useEffect(() => {
        setNum(num)
        console.log(number);
        let myCanvas = canvasEl.current;
        let ctx = myCanvas.getContext('2d');
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
        let gridSize = number;
        draw(ctx, gridSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[num])

    return (
        <CanvasStyle>
            <canvas ref={canvasEl} width="400" height="400"></canvas>
        </CanvasStyle>
    )
}

export default CanvasDemo;
