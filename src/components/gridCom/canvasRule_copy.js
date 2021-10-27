/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-10-26 15:23:30
 * @LastEditTime: 2021-10-27 09:57:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\gridCom\canvasRule_copy.js
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const RuleBodyStyle = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
`

function RuleDemoComponent(props) {
    const canvasEl = useRef(null);
    //设置外边距
    const [AXIS_MARGIN, SET_AXIS_MARGIN] = useState({ x: 40, y: 40 });
    //设置相距画布左上(0, 0)的距离
    const [AXIS_ORIGIN, SET_AXIS_ORIGIN] = useState({ x: AXIS_MARGIN.x, y: AXIS_MARGIN.y });
    //设置x轴顶点位置
    const [AXIS_RIGHT, SET_AXIS_RIGHT] = useState(0);
    //设置y轴顶点位置
    const [AXIS_TOP, SET_AXIS_TOP] = useState(0);
    //设置横向刻度线间距
    const [HORIZONTAL_TICK_SPACING, SET_HORIZONTAL_TICK_SPACING] = useState(10);
    //设置纵向刻度线间距
    const [VERTICAL_TICK_SPACING, SET_VERTICAL_TICK_SPACING] = useState(10);
    //x轴长度
    const [AXIS_WIDTH, SET_AXIS_WIDTH] = useState(0);
    //y轴长度
    const [AXIS_HEIGHT, SET_AXIS_HEIGHT] = useState(0);
    //x轴上的点的最大值
    const [NUM_HORIZONTAL_TICKS, SET_NUM_HORIZONTAL_TICKS] = useState(0);
    //y轴上的点的最大值
    const [NUM_VERTICAL_TICKS, SET_NUM_VERTICAL_TICKS] = useState(0);
    //设置刻度线间距
    const [TICK_WIDTH, SET_TICK_WIDTH] = useState(10);
    //设置刻度线宽度
    const [TICKS_LINE_WIDTH, SET_TICKS_LINE_WIDTH] = useState(0.5);
    //设置刻度线颜色
    const [TICK_COLOR, SET_TICK_COLOR] = useState('navy');
    //设置坐标轴的宽度
    const [AXIS_LINE_WIDTH, SET_AXIS_LINE_WIDTH] = useState(1.0);
    //设置坐标轴颜色
    const [AXIS_COLOR, SET_AXIS_COLOR] = useState('gray');
    //设置数字与x坐标轴的距离
    const [SPACE_BETWEEN_LABELS_AND_AXIS_X, SET_SPACE_BETWEEN_LABELS_AND_AXIS_X] = useState(-20);
    //设置数字与y坐标轴的距离
    const [SPACE_BETWEEN_LABELS_AND_AXIS_Y, SET_SPACE_BETWEEN_LABELS_AND_AXIS_Y] = useState(20);
    //设置网格线颜色
    const [GRID_COLOR, SET_GRID_COLOR] = useState('gray');
    //网格线的宽度
    const [GRID_LINE_WIDTH, SET_GRID_LINE_WIDTH] = useState(0.5);
    //网格线x距离
    const [GRID_LINE_SPACE_X, SET_GRID_LINE_SPACE_X] = useState(10);
    //网格线y距离
    const [GRID_LINE_SPACE_Y, SET_GRID_LINE_SPACE_Y] = useState(10);
    //设置数字标签的颜色
    const [FILL_STYLE, SET_FILL_STYLE] = useState('blue');

    //绘制网格线
    function drawGrid(context) {
        context.strokeStyle = GRID_COLOR;
        context.lineWidth = GRID_LINE_WIDTH;
        for (let i = GRID_LINE_SPACE_X + 0.5 + AXIS_ORIGIN.x; i < context.canvas.width; i += GRID_LINE_SPACE_X) {
            console.log(i, 11)
            context.beginPath();
            context.moveTo(i, AXIS_ORIGIN.x);
            context.lineTo(i, context.canvas.height);
            context.stroke();
        }
        for (let i = GRID_LINE_SPACE_Y + 0.5 + AXIS_ORIGIN.y; i < context.canvas.height; i += GRID_LINE_SPACE_Y) {
            console.log(i, 22);
            context.beginPath();
            context.moveTo(AXIS_ORIGIN.y, i);
            context.lineTo(context.canvas.width, i);
            context.stroke();
        }
    }

    //绘制X轴
    function drawHorizontalAxis(context) {
        context.beginPath();
        context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
        context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
        context.stroke();
    }

    //绘制y轴
    function drawVerticalAxis(context) {
        context.beginPath();
        context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
        context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
        context.stroke();
    }

    //绘制x轴刻度
    function drawHorizontalAxisTicks(context) {
        //小刻度长度的临时变量
        let deltaY;
        for (let i = 1; i < NUM_HORIZONTAL_TICKS; i++) {
            context.beginPath();
            //每5第五个刻度为长的小刻度
            deltaY = i % 5 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;
            context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y - deltaY);
            context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y + deltaY);
            context.stroke();
        }
    };

    //绘制y轴刻度
    function drawVerticalAxisTicks(context) {
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

    //画坐标轴
    function drawAxis(context) {
        context.save();
        context.strokeStyle = AXIS_COLOR;
        context.lineWidth = AXIS_LINE_WIDTH;

        drawHorizontalAxis(context);
        drawVerticalAxis(context);

        context.lineWidth = TICKS_LINE_WIDTH;
        context.strokeStyle = TICK_COLOR;

        drawVerticalAxisTicks(context);
        drawHorizontalAxisTicks(context);

        context.restore();
    }

    //添加坐标轴数字标签
    function drawAxisLabels(context) {
        context.fillStyle = FILL_STYLE;
        drawHorizontalAxisLabels(context);
        drawVerticalAxisLabels(context);
    };

    //添加横坐标数字标签
    function drawHorizontalAxisLabels(context) {
        context.textAlign = 'center';
        context.textBaseline = 'top';
        for (let i = 0; i <= NUM_HORIZONTAL_TICKS; ++i) {
            if (i % 5 === 0) {
                context.fillText(i * 10,
                    AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING,
                    AXIS_ORIGIN.y + SPACE_BETWEEN_LABELS_AND_AXIS_X);
            }
        }
    };

    //添加纵坐标数字标签
    function drawVerticalAxisLabels(context) {
        context.textAlign = 'right';
        context.textBaseline = 'middle';
        for (let i = 0; i <= NUM_VERTICAL_TICKS; ++i) {
            if (i % 5 === 0) {
                context.fillText(i * 10,
                    AXIS_ORIGIN.x - SPACE_BETWEEN_LABELS_AND_AXIS_Y,
                    i * VERTICAL_TICK_SPACING + AXIS_ORIGIN.y);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasEl.current;
        const context = canvas.getContext('2d');
        SET_AXIS_RIGHT(canvas.height - AXIS_MARGIN.x);
        SET_AXIS_TOP(canvas.height - AXIS_MARGIN.y);
        SET_AXIS_WIDTH(canvas.height  - AXIS_ORIGIN.x);
        SET_AXIS_HEIGHT(canvas.height  - AXIS_ORIGIN.y);
        SET_NUM_HORIZONTAL_TICKS((canvas.height  - AXIS_ORIGIN.x) / HORIZONTAL_TICK_SPACING);
        SET_NUM_VERTICAL_TICKS((canvas.height  - AXIS_ORIGIN.y) / VERTICAL_TICK_SPACING);
        drawAxis(context);
        drawAxisLabels(context);
        drawGrid(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AXIS_RIGHT, AXIS_TOP, AXIS_WIDTH, AXIS_HEIGHT, NUM_HORIZONTAL_TICKS, NUM_VERTICAL_TICKS])

    return (
        <RuleBodyStyle>
            <canvas id='canvasRule' ref={canvasEl} width='1000' height='1000'></canvas>
        </RuleBodyStyle>
    )
}

const RuleDemo = React.memo(RuleDemoComponent);

export default RuleDemo;