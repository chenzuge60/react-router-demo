/*
 * @Author: your name
 * @Date: 2021-03-25 16:49:52
 * @LastEditTime: 2021-09-27 10:08:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\App.js
 */
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink, //当前选择项高亮
    Redirect
} from "react-router-dom";
import Home from './components/Home';
import News from './components/News';
import Profile from './components/Profile';
import './css/index.css';
import axios from 'axios';
import MenuLink from './components/MenuLink';
import 'antd/dist/antd.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            urlData: []
         }
    }
    
    componentDidMount() {
        //获取远端数据
        axios.get('http://localhost:7300/mock/604f2f70c916e2097cbca0aa/example/getUrl').then((res) => {
            this.setState({
                urlData: res.data.data
            })
        })
    }

    render() { 
        return ( 
            <React.Fragment>
                <Router>
                    <div>
                        <div className="navTop">
                            {/* <h1>React路由</h1> */}
                            {/* {
                                this.state.urlData.map((item, index) => {
                                    return <NavLink key={index} to={item.url} activeClassName="selected">{item.name}&nbsp;&nbsp;</NavLink>
                                })
                            } */}
                            {/* <br/> */}
                            <div className="selectedURL">
                                {
                                    this.state.urlData.map((item, index) => {
                                        return <MenuLink key={index} to={item.url} label={item.name} />
                                    })
                                }
                            </div>
                        </div>
                        <Switch>
                            <Route exact path="/"  component={Home}></Route>
                            <Route path="/home" component={Home}></Route>
                            <Route path="/news" component={News}></Route>
                            <Route path="/profile" component={Profile}></Route>
                            <Route path="/about" children={(props)=>{
                                return (
                                    <div>
                                        <h2>children</h2>
                                    </div>
                                )
                            }}></Route>
                            <Route path="/notfound" render={()=>{
                                return (
                                    <div>Not Found</div>
                                )
                            }}></Route>
                            <Redirect from="*" to="/notfound"></Redirect>
                        </Switch>
                    </div>
                </Router>
            </React.Fragment>
            
         );
    }
}
 
export default App;