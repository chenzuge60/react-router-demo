/*
 * @Author: your name
 * @Date: 2021-03-25 17:20:50
 * @LastEditTime: 2021-10-26 17:52:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\News\index.js
 */
import React, { Component, useState, useEffect } from 'react';
import RuleDemo from '../gridCom/canvasRule_copy';
import { Button } from 'antd';
import Draggable from 'react-draggable';

const color = ['#d234cd96', '#434d9696', '#24b00a96'];
class News extends Component {
    lineEl = React.createRef()
    dragRef = React.createRef()
    constructor(props) {
        super(props);
        this.state = { 
            componentArray: [], //渲染组件时需要，如果后续JSON配置，可作为渲染条件进行组件的渲染
            tempArr: [], //组件的位置信息，后续可把state中所有涉及到位置、大小的数据集进行整合
            offsetMap: [], //从外层拖拽时的偏移量
            objX: {}, // 绘制纵向线的比对依据
            objY: {}, // 绘制横向线的比对依据
            canvas: null,
            context: null, 
            sizeArr: [], //组件大小的集合，后续可把state中所有涉及到位置、大小的数据集进行整合
            curId: null, //当前拖拽的组件的id，防止start与stop时的落点不同导致组件id匹配不上
            isShow: false, //是否显示控制点
            layOutMarginLeft: 65,
            origin: { x:105, y:132 } //剔除画布的padding值后
         }
    }

    componentDidMount(){
        const canvas = this.lineEl.current;
        const context = canvas.getContext('2d');
        this.setState({
            canvas, context
        })
    }

    //添加组件
    addRec = () => {
        this.setComBaseData(0)
    }

    //不同添加组件的方式去初始化组件
    setComBaseData = (mode, obj) => {
        if(this.state.componentArray.length >= 3) return;
        let arr = [...this.state.componentArray];
        arr.push(1);
        let arr_ = [...this.state.tempArr];
        let offset_ = [...this.state.offsetMap];
        if(Number(mode) === 0){
            arr_.push({
                left: 105,
                right: 145,
                top: 174,
                bottom: 214
            })
            offset_.push({
                x: 0,
                y: 0
            })
        }else {
            obj && arr_.push({
                left: obj.pageX - 20,
                right: obj.pageX + 20,
                top: obj.pageY - 20,
                bottom: obj.pageY + 20
            })
            offset_.push({
                x: obj.pageX - 20 - this.state.origin.x,
                y: obj.pageY - 20 - this.state.origin.y
            })
        }
        let sizeArr = [...this.state.sizeArr];
        sizeArr.push({width: 40, height: 40})
        this.setState({
            componentArray: arr,
            tempArr: arr_,
            sizeArr: sizeArr,
            offsetMap: offset_
        })
    }

    //双击时触发显示控制点
    handleShowDot = () => {
        this.setState(state => ({    
            isShow: !state.isShow
        }))
    }

    //拖拽开始的回调
    dragStart = (e) => {
        // console.log(e, e.target.id,'start');
        this.setState({
            curId: e.target.id
        })
    }

    //拖拽时的回调
    //movementX与movementY的正负表示左右或上下
    dragMove = (e) => {
        console.log(e, 'move');
        const { curId, sizeArr } = this.state;
        let objX = {}, objY = {};
        let arr = [...this.state.tempArr]
        arr && arr.forEach((el, index) => {
            if(Number(curId) !== index){
                //左侧线的吸附
                if(e.movementX > 0){
                    //设置吸附阈值
                    // const ADSORB = 2;
                }
                objX[el.left] ? objX[el.left].push(index) : (objX[el.left] = [index]);
                objX[el.right] ? objX[el.right].push(index) : (objX[el.right] = [index]);
                objY[el.top] ? objY[el.top].push(index) : (objY[el.top] = [index]);
                objY[el.bottom] ? objY[el.bottom].push(index) : (objY[el.bottom] = [index]);
            }
        })
        let lu = { x: e.pageX - e.offsetX, y: e.pageY - e.offsetY};
        let rb = { x: e.pageX - e.offsetX + sizeArr[curId].width, y: e.pageY - e.offsetY + sizeArr[curId].height};
        let left = this.getLine(lu, rb, objX)
        this.drawLine(left)
    }

    //获取绘制点的集合
    getLine = (lu, rb, objX) => {
        const { tempArr } = this.state;
        //线的坐标点的集合
        console.log(Reflect.ownKeys(objX), 888);
        Reflect.ownKeys(objX).forEach((X) => {
            if(Math.abs(X - lu.x) <= 2){
                // console.log( getComputedStyle(this.dragRef) ,1111111111)
                // let offset_ = [...this.state.offsetMap];
                // let obj = {

                // }
            }
        })
        let fin = [];
        if(objX[lu.x]){
            objX[lu.x].forEach(e => {
                let obj = {
                    start: {
                        x: lu.x,
                        y: lu.y > tempArr[e].top ? tempArr[e].top : lu.y
                    },
                    end: {
                        x: lu.x,
                        y: rb.y > tempArr[e].bottom ? rb.y : tempArr[e].bottom
                    }
                }
                fin.push(obj)
            })
        }
        return fin
    }

    //绘制边线，目前只考虑了左边线重叠时候的线的绘制，后续需补充其他
    drawLine = (fin) => {
        const { canvas, context, layOutMarginLeft, origin } = this.state;
        context.strokeStyle = 'green';
        context.lineWidth = 1;
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.beginPath();
        fin && fin.forEach(e => {
            context.moveTo(e.start.x - 1 - layOutMarginLeft, e.start.y - origin.y);
            context.lineTo(e.end.x - 1 - layOutMarginLeft, e.end.y - origin.y);
        })
        context.closePath();
        context.stroke();
    }

    //拖拽结束时回调函数
    dragStop = (e) => {
        const { curId, sizeArr } = this.state;
        let arr = this.state.tempArr;
        let obj = {
            left: e.pageX - e.offsetX,
            right: e.pageX - e.offsetX + sizeArr[curId].width,
            top: e.pageY - e.offsetY, 
            bottom: e.pageY - e.offsetY + sizeArr[curId].height
        }
        arr[curId] = obj;
        this.setState({
            tempArr: arr
        })
    }

    // 放大|缩放 时重置大小，回调参数由点击组件回传
    handleSize = (obj, id) => {
        const { sizeArr } = this.state;
        let newArr = sizeArr;
        let obj_ = {
            width: obj.x + newArr[id].width,
            height: obj.y + newArr[id].height
        }
        newArr[id] = obj_;
        this.setState({
            sizeArr: newArr
        })
    }

    //外层组件直接拖拽开始事件
    outDragStart = (e) => {
        // console.log(e, 999);
    }

    //外层组件拖拽过程中触发事件
    outDragMove = (e) => {
        // console.log(e, 777);
    }

    //外层组件拖拽结束事件
    outDragEnd = (e) => {
        this.setComBaseData(1, e)
    }

    render() { 
        const {
            offsetMap,
            isShow,
            sizeArr
        } = this.state;
        return ( 
            <div>
                <Button onClick={() => this.addRec()}>添加</Button>
                <div style={{ display: 'flex' }}>
                <div style={{ width: '50px', listStyle: 'none', marginTop: '20px', marginLeft: '15px' }}>
                    <li draggable="true" 
                        onDragStart={(e) => {
                            this.outDragStart(e)
                        }}
                        onDrag={(e) => {
                            this.outDragMove(e)
                        }}
                        onDragEnd={(e) => {
                            this.outDragEnd(e)
                        }}
                        >
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#2ac786' }}></div>
                    </li>
                    <li></li>
                    <li></li>
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                    <div draggable={false} style={{ position: 'absolute', zIndex: -10 }}> <RuleDemo /> </div>          
                    <div style={{padding: '40px 40px', width: '600px', height: '600px', position: 'relative'}}>
                        {
                            this.state.componentArray.map((el,index) => {
                                return (
                                    <Draggable 
                                                key={index}
                                                ref={this.dragRef}
                                                onStart={(e) => this.dragStart(e)}
                                                onDrag={(e) => this.dragMove(e)}
                                                onStop={(e) => this.dragStop(e)}
                                                bounds={{top: 0, left: 0, right: 600, bottom: 600}}
                                                defaultPosition={{x: offsetMap[index].x, y: offsetMap[index].y}}>
                                        <div onDoubleClick={this.handleShowDot}>
                                            <NewComponent 
                                                index={index} 
                                                isShow={isShow}
                                                width={sizeArr[index].width + 'px'} 
                                                height={sizeArr[index].height + 'px'}
                                                setSize={this.handleSize}
                                            /></div>
                                    </Draggable>
                                )
                            })
                        }
                    </div>
                    {/* 此处padding左右设置为0，是因为网格区左偏移40px */}
                    <div style={{ position: 'absolute', zIndex: -1, top: 0, left: 0, padding: '40px 0', }}> 
                        <canvas id='lineDemo' ref={this.lineEl} width='1000' height='1000'></canvas>
                    </div>
                </div>
                
                </div>    
            </div>
         );
    }
}

//处理鼠标落下事件
function handleMouseDown(e, cb_) {
    e.stopPropagation();
    let initState = { x: e.pageX, y: e.pageY }
    let cb = cb_;
    //处理move事件
    const move = (moveEvent) => {
        moveEvent.stopPropagation();
        let offsetX = moveEvent.pageX - initState.x, offsetY = moveEvent.pageY - initState.y;
        let obj = {
            x: offsetX,
            y: offsetY
        }
        cb(obj, e.target.id)
        initState = { x: moveEvent.pageX, y: moveEvent.pageY }
    };
    //处理up事件
    const up = () => {
        e.stopPropagation();
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
}


function NewComponent(props){
    const { index, width, height, setSize, isShow } = props;
    const [showDot, setDot] = useState(false)
    useEffect(()=> {
        setDot(isShow)
    }, [isShow])

    return (
        <div style={{ 
                border: showDot ? '1px solid #007fff' : '0', 
                position: 'absolute' }}>
            <span 
                id={index}
                style={{ 
                        position: 'absolute', 
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: 'blue', 
                        bottom: '-5px', 
                        right:  '-5px', 
                        display: showDot ? 'block' : 'none' }}
                onMouseDown={(e) => {
                    handleMouseDown(e, setSize)
                }}
                ></span>
           <div id={index} style={{ background: color[index], width: width, height: height }}></div> 
        </div>
    )
}
 
export default News;