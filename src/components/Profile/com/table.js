/*
 * @Author: your name
 * @Date: 2021-09-27 11:27:58
 * @LastEditTime: 2021-09-30 11:09:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\Profile\com\table.js
 */
import React, { PureComponent  } from 'react';
import { Table } from 'antd';

class TableDemo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        console.log(this.props.rowData, this.props.titleData);
        return ( 
            <>
                <Table bordered={true} pagination={false} dataSource={this.props.rowData} columns={this.props.titleData} />
            </>
         );
    }
}
 
export default TableDemo;