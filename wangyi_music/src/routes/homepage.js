import React from 'react';

import { connect } from 'dva';  // 相对于react-redux 中的connect 。主要获取方法和数据

import styles from './homepage.css'

import Header from '../components/Header';

function Homepage(){

    return (

        <div className={styles.allpage}>
            {/*  设置header */}
             <div className={styles.headertop}>
                <Header />
             </div>

             {/* 设置 选择的图标*/}
             <div className='styles.icons'>
                
             </div>
             
        </div>
    )
}


export default connect()(Homepage);