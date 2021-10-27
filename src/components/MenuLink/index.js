/*
 * @Author: your name
 * @Date: 2021-03-25 18:30:24
 * @LastEditTime: 2021-03-28 17:02:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-app\src\components\MenuLink\index.js
 */
import React from 'react';
import { Route, Link } from 'react-router-dom';

export default function MenuLink({to, label}) {
    return (
        <Route path={to} children={({match})=> {
            return <Link className={match ? 'active' : ''} to={to}>{label}</Link>
        }} />
    )
}