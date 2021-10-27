/*
 * @Author: your name
 * @Date: 2021-03-25 17:21:25
 * @LastEditTime: 2021-09-30 10:49:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\Profile\index.js
 */
import React, { Component } from 'react';
import { Modal, Button, Input, Select, Table, Tooltip, Tag } from 'antd';
import './index.css'
// import styled from 'styled-components';
// import Draggable from 'react-draggable';
import axios from 'axios';
import Validate from './validate';
import Calculate from './calculate';
import TableDemo from './com/table';

// const returnStyle = styled.div`
//     background: url("../../../public/return.png")
// `

const { Search } = Input;
const { Option } = Select;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            show: false,
            search: false,
            type: 0,
            value: [], //变量集合
            bounds: { left: 0, right: 0, bottom: 0, top: 0 },
            urlData: [],
            selected: [],
            relation: {},
            rowData: [],  //初始化rowData
            titleData: [], //初始化titleData
            extraTitle: [], //添加的title
            selectedModel: [],
            trashBin: []
        }
    }

    draggleRef = React.createRef();
    selectRef = React.createRef();
    outColRef_key = React.createRef();
    outColRef_name = React.createRef();

    componentDidMount = () => {
        //获取远端数据
        axios.get('http://localhost:7300/mock/6135cb10ed54a30020b3e7c5/example/getOption').then((res) => {
            let newData = res.data.data.map((e, index) => {
                return { value: e, text: e }
            })
            this.setState({
                urlData: newData
            })
        })
        axios.get("http://localhost:7300/mock/6135cb10ed54a30020b3e7c5/example/getTitle").then((res) => {
            this.setState({ titleData: res.data.data })
        })
        axios.get("http://localhost:7300/mock/6135cb10ed54a30020b3e7c5/example/getRowData").then((res) => {
            let init = res.data.data[0];
            let data = [];
            for(let i = 0; i < 6; i++){
                data.push({key: i, ...init})
            }
            this.setState({ rowData: data })
        })
    }

    //对话框确认时的回调
    handleOk = () => {
        let addTitle = {
            title: this.outColRef_name.current.state.value,
            dataIndex: this.outColRef_key.current.state.value,
            key: this.outColRef_key.current.state.value,
        }
        let addTitleSource = {...addTitle, model: this.state.model};
        let res = this.analysisCal(this.state.model, addTitle)
        res && this.setState({
            show: false
        }, ()=> {
            let temp = [...this.state.selectedModel];
            temp.push(addTitleSource)
            this.resetState()
            this.setState({
                selectedModel: temp
            })
        })
    }

    //恢复已删除模型
    recoverModel = () => {

    }

    //对话框取消时的回调
    handleCancel = () => {
        this.resetState()
        this.setState({
            show: false
        })
    }

    //输入公式后的查询功能
    onSearch = (e) => {
        this.setState({ search: true, model: e })
        this.getValue(e)
        //校验公式
        if (Validate(e)) {
            setTimeout(() => {
                this.setState({
                    search: false,
                    type: 1
                })
            }, 500)
        } else {
            alert('Check error, please re-enter!')
            this.setState({ search: false })
        }

    }

    //返回上一步
    handleBack = (event, type) => {
        event.stopPropagation();
        this.resetState()
        this.setState({ type: type })
    }

    //对话框可移动
    onStart = (event, uiData) => {
        const { clientWidth, clientHeight } = window?.document?.documentElement;
        const targetRect = this.draggleRef?.current?.getBoundingClientRect();
        this.setState({
            bounds: {
                left: -targetRect?.left + uiData?.x,
                right: clientWidth - (targetRect?.right - uiData?.x),
                top: -targetRect?.top + uiData?.y,
                bottom: clientHeight - (targetRect?.bottom - uiData?.y),
            },
        });
    };

    //option选择时的回调
    handleSelect = (e, index, v) => {
        //已选择option
        let temp = [...this.state.selected];
        temp[index] = e;
        //设置已选择关系
        let relation = this.state.relation;
        relation[v] = e;
        this.setState({ selected: temp, relation: relation })
    }

    //option清除时的回调
    handleClear = (e, index) => {
        //删除此项option
        let temp = [...this.state.selected];
        temp[index] = undefined;
        //删除relation
        let relation = this.state.relation;
        if (relation[e]) delete relation[e];
        this.setState({ selected: temp, relation: relation })
    }

    //初始数据应该过滤不是数值的数据
    //获取渲染option Dom结构，过滤已选择
    getOption = () => {
        //判断数据是否由以下几种条件组成
        /**
         * 1、数字
         * 2、%
         * 3、NAN
         */
        let rowData = this.state.rowData;
        let titleData = this.state.titleData;
        let tempData = [];
        rowData && titleData.forEach(e => {
            let reg = rowData[0][e['dataIndex']];
            if( /^(-?\d+)(\.\d+)?[%]$/.test(reg) || /^(-?\d+)(\.\d+)?$/.test(reg)){
                tempData.push(e)
            }else if(reg === 'NAN'){
                tempData.push(e)
            }
        })
        return tempData.map(d => <Option key={d.key}>{d.dataIndex}</Option>).filter(i => {
            return this.state.selected.indexOf(i.props.children) === -1
        });
    }

    //重置状态
    resetState = () => {
        let selected = [], relation = {}, model = '';
        this.setState({ selected, relation, model })
    }

    //获取公式中变量
    getValue = (str) => {
        let tmpStr = str.replace(/[\(\)\x\÷\+\-\*\/]{1,}/g, ',');
        let array = tmpStr.split(',');
        let valueArr = [...new Set(array.filter(e => !/^(\-|\+)?\d+(\.\d+)?$/.test(e)))].filter(e => e !== '');
        this.setState({ value: valueArr })
    }



    //按照映射关系替换变量
    changeValue = (str, obj = {}) => {
        debugger
        let relation = { ...this.state.relation };
        let relationValues = Object.values(relation);
        let relationKeys = Object.keys(relation);
        // debugger
        Reflect.ownKeys(
            Object(obj)
            // obj
        ).forEach(v => {
            let indexOf = relationValues.indexOf(v);
            debugger
            if (indexOf !== -1) {
                let key = relationKeys[indexOf];
                debugger
                relation[key] = obj[v];
            }
        })
        let tempArr = [];
        let operate = ['(', ')', '+', '-', '*', '/'];
        let valueStr = '';
        for (let i = 0; i < str.length; i++) {
            if (operate.indexOf(str.charAt(i)) === -1) {
                valueStr += str.charAt(i);
            } else if (operate.indexOf(str.charAt(i)) !== -1) {
                tempArr.push(valueStr)
                tempArr.push(str.charAt(i))
                valueStr = ''
            }
        }
        if (valueStr.length > 0) tempArr.push(valueStr)
        //转换为数字这里有问题，前面需要去重
        let newTemp = tempArr.map(e => {
            if (relation[e]) return relation[e]
            else return e
        })
        return newTemp.join('')
    }

    //解析计算公式
    analysisCal = (str, addTitle) => {
        //构建选择数据对应列值
        // console.log(this.state.selected, 'selected');
        // console.log(this.state.rowData, 'rowData');
        // console.log(this.state.relation, 'relation');
        try {
            let newRowData = [];
            let newTitle = addTitle;
            let newTitleData = this.state.titleData;
            newTitleData.push(newTitle);
            newRowData = this.state.rowData.map((v, index) => {
                let obj = {};
                //是否需要计算
                let isNeedCal = true;
                //最终计算结果
                let final;
                try {
                    this.state.selected.forEach(e => {
                        let value = String(this.state.rowData[index][e]);
                        //NAN值处理
                        if (value === 'NAN') {
                            final = 'NAN'
                            isNeedCal = false
                            throw new Error('NAN')
                        }
                        //过滤滤值
                        obj[e] = value.indexOf('%') === -1 ? value : value.slice(0, str.length - 1)
                    })
                }
                catch (e) {
                    console.log('Cycle End!');
                }
                if (isNeedCal) final = Calculate(this.changeValue(str, obj));
                Object(v)[newTitle['dataIndex']] = final;
                return v
            })
            this.setState({
                titleData: [...newTitleData],
                rowData: [...newRowData]
            })
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    //处理标签删除
    handleTagClose = (e, value) => {
        e.stopPropagation();
        const { selectedModel, rowData, titleData, trashBin } = this.state;
        let tempSelectedModel = selectedModel.filter(v => {
            return value.key !== v.key
        });
        let tempRowData = rowData.map(v => {
            delete v[value.dataIndex]
            return v
        })
        let tempTitleData = titleData.filter(v => {
            return v.key !== value.key;
        })
        let tempTrashBin = [...trashBin, value];
        this.setState({
            selectedModel: tempSelectedModel,
            rowData: tempRowData,
            titleData: tempTitleData,
            tempTrashBin: tempTrashBin
        })
    }

    render() {
        // console.log(this.state.titleData, this.state.rowData, 'title&&row')
        const tagColor = ["magenta", "red", "volcano", "orange", "gold", "lime", "green"];
        return (
            <div className='profile'>
                <div className="profile-title">Model Test -- 模型测试</div>
                <div>
                    <Tooltip title="点击输入计算模型" placement="rightBottom">
                        <Button onClick={() => { this.setState({ show: true, type: 0 }) }}>WorkFlow</Button>
                    </Tooltip>
                    <div className="selectedTag">
                        <div style={{ width: "160px", color: "#4f6c79", fontSize: "14px" }}>{this.state.selectedModel.length > 0 ? "已选择计算模型" : "暂未选择计算模型"}</div>
                        <div>
                            {
                                this.state.selectedModel && this.state.selectedModel.map((v, index) => {
                                    return (
                                        <Tooltip key={v.key} title={v.model} placement="right">
                                            <Tag 
                                            closable={true} 
                                            color={tagColor[index]}
                                            onClose={(e) => this.handleTagClose(e, v)}>
                                                {v.title}
                                            </Tag>
                                        </Tooltip>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={{ width: 'auto', height: 'auto' }}>
                    <TableDemo rowData={this.state.rowData} titleData={this.state.titleData}/>
                </div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.show}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                // modalRender={modal => (
                //     <Draggable
                //         disabled={false}
                //         bounds={this.state.bounds}
                //         onClick={(e)=> {e.stopPropagation()}}
                //         onStart={(event, uiData) => this.onStart(event, uiData)}
                //     >
                //         <div ref={this.draggleRef}>{modal}</div>
                //     </Draggable>
                // )}
                >
                    {
                        this.state.type === 0 ? <div>
                            <h3>Input Model</h3>
                            <Search placeholder="input search text" onSearch={this.onSearch} enterButton loading={this.state.search} />
                        </div>
                            :
                            <div ref={this.selectRef} style={{ position: 'relative', height: 'auto', overflowY: 'auto' }}>
                                {/* <returnStyle></returnStyle> */}
                                <div className="backClass" onClick={(e) => this.handleBack(e, 0)}></div>
                                <h3 style={{ marginTop: '16px' }}>Select Association</h3>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ maxWidth: 160, lineHeight: 2 }}>公式：{this.state.model}&nbsp;&nbsp;&nbsp;</div>
                                    <div style={{ flex: 1 }}>
                                        <Input.Group>
                                            <Input ref={this.outColRef_key} addonAfter={
                                                <div style={{ width: 40 }}>key</div>
                                            }
                                                placeholder="Input column key" style={{ width: 150, marginRight: 10 }}/>
                                            <Input ref={this.outColRef_name} addonAfter={
                                                <div style={{ width: 40 }}>名称</div>
                                            }
                                                placeholder="Input column name" style={{ width: 150 }} />
                                        </Input.Group>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: 10 }}>
                                    {
                                        this.state.value && this.state.value.map((v, index) => {
                                            return (
                                                <div key={index} style={{ position: 'relative', height: '40px' }}>
                                                    <div className="liStyle">{v}</div>
                                                    <div className="changeImg"></div>
                                                    <div className="selectedStyle">
                                                        <Select
                                                            showSearch
                                                            style={{ width: 200 }}
                                                            placeholder="Select a person"
                                                            optionFilterProp="children"
                                                            options={this.state.options}
                                                            onSelect={(e) => this.handleSelect(e, index, v)}
                                                            onClear={() => this.handleClear(v, index)}
                                                            allowClear={true}
                                                            // onChange={onChange}
                                                            // onFocus={onFocus}
                                                            // onBlur={onBlur}
                                                            filterOption={(input, option) =>
                                                                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {this.getOption()}
                                                        </Select>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                    }
                </Modal>
            </div>
        );
    }
}

export default Profile;