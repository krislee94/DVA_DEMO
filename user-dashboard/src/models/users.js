/**
 * model users.js的设计、
 * 按照数据维度的 model 设计原则就是抽离数据本身以及相关操作的方法，
 */
import { hashHistory } from 'dva/router';

import { query } from '../services/users';
// 处理异步请求

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    loading: false, // 控制加载状态
    current: null, // 当前分页信息
    currentItem: {}, // 当前操作的用户对象
    modalVisible: false, // 弹出窗的显示状态
    modalType: 'create', // 弹出窗的类型（添加用户，编辑用户）
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' }); //put表示dispatch action
      const { data } = yield call(query); //call表示调用 异步函数
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            total: data.page.total,
            current: data.page.current
          }
        });
      }
    },
    *create() { 
      
    },
    // 因为delete是关键字
    *'delete'() { },
    *update() { },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/users') {
          dispatch({
            type: 'querySuccess',
            payload: {} // 调用时传递的参数
          });
        }
      });
    },
  },
  reducers: {
    //业务纬度的设计(更多会考虑交互上的问题)
    showLoading(state, action) {
      return { ...state, loading: true };
    }, // 控制加载状态的 reducer
    showModal() { }, // 控制 Modal 显示状态的 reducer
    hideModal() { },
    //数据纬度的设计
    // 使用服务器数据返回
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    createSuccess() { },
    deleteSuccess() { },
    updateSuccess() { },
  }
}
