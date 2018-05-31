/**
 * 和后台的交互。
 * // request 是我们封装的一个网络请求库
 * users.js
 */

import request from '../utils/request';

import qs from 'qs';

export async function query(params) {
    return request(`/api/users?${qs.stringify(params)}`);
}