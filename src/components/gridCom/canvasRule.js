/*
 * @Author: your name
 * @Date: 2021-09-14 10:59:19
 * @LastEditTime: 2021-10-26 17:41:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\gridCom\canvasRule.js
 */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const RuleBodyStyle = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
`

function valueFactory(canvas){
    //外边距
    const AXIS_MARGIN = 40,
    //原点，将之设置到画布左下区域
    AXIS_ORIGIN = {x: AXIS_MARGIN, y: AXIS_MARGIN},

    //y轴顶点位置
    AXIS_TOP = canvas.height - AXIS_MARGIN,
    //x轴顶点位置
    AXIS_RIGHT = canvas.width - AXIS_MARGIN,

    //横向刻度线间距
    HORIZONTAL_TICK_SPACING = 10,
    //垂直刻度线间距
    VERTICAL_TICK_SPACING = 10,

    //X轴长度
    AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
    //y轴长度
    AXIS_HEIGHT = AXIS_TOP - AXIS_ORIGIN.y,

    //y轴上的点的最大值
    NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING,
    NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING,

    TICK_WIDTH = 10,
    TICKS_LINEWIDTH = 0.5,
    TICK_COLOR = 'navy',

    AXIS_LINEWIDTH = 1.0,
    AXIS_COLOR = 'gray',
    //数字与坐标轴的距离
    SPACE_BETWEEN_LABELS_AND_AXIS_X = -20,
    SPACE_BETWEEN_LABELS_AND_AXIS_Y = 20;

    let obj = {
        AXIS_MARGIN: AXIS_MARGIN,
        AXIS_ORIGIN: AXIS_ORIGIN,
        AXIS_TOP: AXIS_TOP,
        AXIS_RIGHT: AXIS_RIGHT,
        HORIZONTAL_TICK_SPACING: HORIZONTAL_TICK_SPACING,
        VERTICAL_TICK_SPACING: VERTICAL_TICK_SPACING,
        AXIS_WIDTH: AXIS_WIDTH,
        AXIS_HEIGHT: AXIS_HEIGHT,
        NUM_VERTICAL_TICKS: NUM_VERTICAL_TICKS,
        NUM_HORIZONTAL_TICKS: NUM_HORIZONTAL_TICKS,
        TICK_WIDTH: TICK_WIDTH,
        TICKS_LINEWIDTH: TICKS_LINEWIDTH,
        TICK_COLOR: TICK_COLOR,
        AXIS_LINEWIDTH: AXIS_LINEWIDTH,
        AXIS_COLOR: AXIS_COLOR,
        SPACE_BETWEEN_LABELS_AND_AXIS_X: SPACE_BETWEEN_LABELS_AND_AXIS_X,
        SPACE_BETWEEN_LABELS_AND_AXIS_Y: SPACE_BETWEEN_LABELS_AND_AXIS_Y
    }
    return obj;
}
/**
 * canvas 绘制标尺
 * 
 * params:{*}
 *      axisWidth:Number,轴线的宽度，单位px
 *      lineColor:String,轴线的颜色
 *      gridWidth:Number,大网格的宽度
 *      gridHeight:Number,大网格的高度
 * 
 * dom:Dom元素,canvas的元素
 */
//绘制网格线
function drawGrid(context, color, stepX, stepY, valueObj){
    const { AXIS_MARGIN } = valueObj;
    context.strokeStyle = color;
    context.lineWidth = 0.5;

    for (let i = stepX + 0.5 + AXIS_MARGIN; i < context.canvas.width; i += stepX) {
        context.beginPath();
        context.moveTo(i, AXIS_MARGIN);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (let i = stepY + 0.5 + AXIS_MARGIN; i < context.canvas.height; i += stepY) {
        context.beginPath();
        context.moveTo(AXIS_MARGIN, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}


/**
 * 绘制x轴
 */
let drawHorizontalAxis=(valueObj, context)=> {
    const { AXIS_ORIGIN, AXIS_RIGHT } = valueObj;
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
    context.stroke();
};


/**
 * 绘制y轴
 */
let drawVerticalAxis=(valueObj, context)=> {
    const { AXIS_ORIGIN, AXIS_TOP } = valueObj;
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
    context.stroke();
};

/**
 * 画坐标轴
 */
let drawAxis=(valueObj, context) =>{
    const { AXIS_COLOR, AXIS_LINEWIDTH, TICKS_LINEWIDTH, TICK_COLOR } = valueObj;
    context.save();
    context.strokeStyle = AXIS_COLOR;
    context.lineWidth = AXIS_LINEWIDTH;

    drawHorizontalAxis(valueObj, context);
    drawVerticalAxis(valueObj, context);

    context.lineWidth = TICKS_LINEWIDTH;
    context.strokeStyle = TICK_COLOR;

    drawVerticalAxisTicks(valueObj, context);
    drawHorizontalAxisTicks(valueObj, context);

    context.restore();
};

/**
 * 绘制y轴刻度
 */
let drawVerticalAxisTicks=(valueObj, context)=> {
    const { NUM_VERTICAL_TICKS, TICK_WIDTH, AXIS_ORIGIN, VERTICAL_TICK_SPACING} = valueObj;
    //小刻度长度的临时变量
    let deltaY;

    for (let i = 1; i < NUM_VERTICAL_TICKS; i++) {
        context.beginPath();
        //每5第五个刻度为长的小刻度
        deltaY = i % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
        context.moveTo(AXIS_ORIGIN.x - deltaY, i * VERTICAL_TICK_SPACING + AXIS_ORIGIN.y);
        context.lineTo(AXIS_ORIGIN.x + deltaY, i * VERTICAL_TICK_SPACING + AXIS_ORIGIN.y);
        context.stroke();

    }
};

/**
 * 绘制x轴刻度
 */
let drawHorizontalAxisTicks=(valueObj, context)=> {
    const { NUM_HORIZONTAL_TICKS, TICK_WIDTH, AXIS_ORIGIN, HORIZONTAL_TICK_SPACING } = valueObj;
    //小刻度长度的临时变量
    let deltaY;

    for (let i = 1; i < NUM_HORIZONTAL_TICKS; i++) {
        context.beginPath();
        //每5第五个刻度为长的小刻度
        deltaY = i % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

        context.moveTo(AXIS_ORIGIN.x+i*HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y-deltaY);
        context.lineTo(AXIS_ORIGIN.x+i*HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y+deltaY);
        context.stroke();

    }
};

/**
 * 添加坐标轴数字标签
 */
let drawAxisLabels=(valueObj, context)=> {
    context.fillStyle = 'blue';
    drawHorizontalAxisLabels(valueObj, context);
    drawVerticalAxisLabels(valueObj, context);
};

/**
 * 添加横坐标数字标签
 */
let drawHorizontalAxisLabels=(valueObj, context)=> {
    const { NUM_HORIZONTAL_TICKS, AXIS_ORIGIN, HORIZONTAL_TICK_SPACING, SPACE_BETWEEN_LABELS_AND_AXIS_X } = valueObj;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    for (let i=0; i <= NUM_HORIZONTAL_TICKS; ++i) {
        if (i % 5 === 0) {
            context.fillText(i*10,
                AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
                AXIS_ORIGIN.y + SPACE_BETWEEN_LABELS_AND_AXIS_X);
        }
    }
};

/**
 * 添加垂直坐标数字标签
 */
let drawVerticalAxisLabels=(valueObj, context)=> {
    const { NUM_VERTICAL_TICKS, AXIS_ORIGIN, VERTICAL_TICK_SPACING, SPACE_BETWEEN_LABELS_AND_AXIS_Y } = valueObj;
    context.textAlign = 'right';
    context.textBaseline = 'middle';

    for (let i=0; i <= NUM_VERTICAL_TICKS; ++i) {
        if (i % 5 === 0) {
            context.fillText(i*10,
                AXIS_ORIGIN.x - SPACE_BETWEEN_LABELS_AND_AXIS_Y,
                i * VERTICAL_TICK_SPACING + AXIS_ORIGIN.y);
        }
    }
};


  
function RuleDemo(props){

    let canvasEl = useRef(null);
    
    useEffect(() => {
        let canvas = canvasEl.current;
        let context = canvas.getContext('2d');
        let valueObj = valueFactory(canvas);
        console.log(context, 'canvas')
        drawAxis(valueObj, context);
        drawAxisLabels(valueObj, context);
        drawGrid(context, 'gray', 10, 10, valueObj);
    }, )

    return (
        <RuleBodyStyle>
                <canvas id='canvasRule' ref={canvasEl} width='1000' height='1000'></canvas>
        </RuleBodyStyle>
        
    )
}

export default RuleDemo;