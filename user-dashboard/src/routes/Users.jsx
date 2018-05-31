import React, { PropTypes } from 'react';

// Users 的 Presentational Component
// 暂时都没实现
import UserList from '../components/Users/UserList';
import UserSearch from '../components/Users/UserSearch';
import UserModal from '../components/Users/UserModal';

import styles from './Users.less';


import {connect} from 'dva'  //这个其实也就是redux中的connect

function Users({location, dispatch, users }){

  const {
    loading, list, total, current,
    currentItem, modalVisible, modalType
    } = users;

  const userSearchProps = {};
  const userListProps = {
    dataSource: list,
		total,
		loading,
		current,
  };
  const userModalProps = {};

return (
  <div className={styles.normal}>
    {/* 用户筛选搜索框 */}
    <UserSearch {...userSearchProps} />
    {/* 用户信息展示列表 */}
    <UserList {...userListProps} />
    {/* 添加用户 & 修改用户弹出的浮层 */}
    <UserModal {...userModalProps} />
  </div>
);

}


Users.propTypes = {
};
// 指定订阅数据，这里关联了 users
function mapStateToProps({users}) {
  return {users};
}
//关联
export default connect(mapStateToProps)(Users);