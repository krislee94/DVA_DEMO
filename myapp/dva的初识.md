---
title: dva的初识
date: 2018-05-28 15:02:34
tags: dva
---



## 内心独白

这段时间以前的同事和我极力安利*dva* 这个框架，我之前确实了解过，但是心想着，我会redux，看到一个技术文章介绍是什么极简的redux实现方式的标题，我就没想深入去了解，何况，本着会*react*,*redux*,*react-router*,*ant-design*吃天下的原则。我就没去深入了解，但是慢慢的接触，我发现dva的框架做的事情真的很多，而且在很多方式简化了编程。今天就了解第一步咱们的dva。

## dva 是什么 

[详细的介绍请看这里](https://github.com/dvajs/dva/issues/1)
这个其实是支付宝整合的一套框架，集成了 (redux + react-router + redux-saga 等)的一层轻量封装。dva 是 framework，不是 library，类似 emberjs。
他最核心的是提供了 app.model 方法，用于把 reducer, initialState, action, saga 封装到一起。

```js
app.model({
  namespace: 'products',
  state: {
    list: [],
    loading: false,
  },
  subscriptions: [
    function(dispatch) {
      dispatch({type: 'products/query'});
    },
  ],
  effects: {
    ['products/query']: function*() {
      yield call(delay(800));
      yield put({
        type: 'products/query/success',
        payload: ['ant-tool', 'roof'],
      });
    },
  },
  reducers: {
    ['products/query'](state) {
      return { ...state, loading: true, };
    },
    ['products/query/success'](state, { payload }) {
      return { ...state, loading: false, list: payload };
    },
  },
});
```
现在来介绍一下这些key:
**(假设你已经熟悉了 redux, redux-saga 这一套应用架构)**

* namespace - 对应 reducer 在 combine 到 rootReducer 时的 key 值
* state - 对应 reducer 的 initialState
* subscription - elm@0.17 的新概念，在 dom ready 后执行，这里不展开解释
* effects - 对应 saga，并简化了使用
* reducers - 相当于数据模型
## 安装一个脚手架吧
dva-cli github的地址在这里：https://github.com/dvajs/dva-cli 。

```
npm install dva-cli -g
```

```
dva new myapp && cd myapp
```

```
npm start
```

如果一切进行的顺利，那么基本上应该是进入到这个页面

![dva-demo](https://upload-images.jianshu.io/upload_images/5531021-2bdb5bd7ecb058c3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 完成几个demo ？

参考链接 - https://github.com/dvajs/dva-docs/blob/master/v1/zh-cn/getting-started.md

这里会教我们启动和开始一个demo ，从而熟悉整个项目

#### 如何去写？

接到需求之后推荐的做法不是立刻编码，而是先以上帝模式做整体设计。

1. 先设计 model
2. 再设计 component
3. 最后连接 model 和 component

#### 首先我们要先定义model

```
app.model({
  namespace: 'count',
  state: {
    record : 0,
    current: 0,
  },
});
```
namespace 是 model state 在全局 state 所用的 key，state 是默认数据。然后 state 里的 record 表示 highest record，current 表示当前速度。

#### 其次设计component
        
完成 Model 之后，我们来编写 Component 。推荐尽量通过 stateless functions 的方式组织 Component，在 dva 的架构里我们基本上不需要用到 state 。


```
import styles from './index.less';
const CountApp = ({count, dispatch}) => {
  return (
    <div className={styles.normal}>
      <div className={styles.record}>Highest Record: {count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={() => { dispatch({type: 'count/add'}); }}>+</button>
      </div>
    </div>
  );
};
```

* 这里先 import styles from './index.less';，再通过 styles.xxx 的方式声明 css classname 是基于 css-modules 的方式，后面的样式部分会用上
* 通过 props 传入两个值，count 和 dispatch，count 对应 model 上的 state，在后面 connect 的时候绑定，dispatch 用于分发 action
* dispatch({type: 'count/add'}) 表示分发了一个 {type: 'count/add'} 的 action

#### 更新state
更新 state 是通过 reducers 处理的。

reducer 是唯一可以更新 state 的地方，这个唯一性让我们的 App 更具可预测性，所有的数据修改都有据可查。reducer 是 pure function，他接收参数 state 和 action，返回新的 state，通过语句表达即 (state, action) => newState。

这个需求里，我们需要定义两个 reducer，add 和 minus，分别用于计数的增和减。值得注意的是 add 时 record 的逻辑，他只在有更高的记录时才会被记录。

>请注意，这里的 add 和 minus 两个action，在 count model 的定义中是不需要加 namespace 前缀的，但是在自身模型以外是需要加 model 的 namespace


```
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
+ reducers: {
+   add(state) {
+     const newCurrent = state.current + 1;
+     return { ...state,
+       record: newCurrent > state.record ? newCurrent : state.record,
+       current: newCurrent,
+     };
+   },
+   minus(state) {
+     return { ...state, current: state.current - 1};
+   },
+ },
});
```
#### 绑定数据
在定义了 Model 和 Component 之后，我们需要把他们连接起来。这样 Component 里就能使用 Model 里定义的数据，而 Model 中也能接收到 Component 里 dispatch 的 action 。

这个需求里只要用到 count。

```
function mapStateToProps(state) {
  return { count: state.count };
}
const HomePage = connect(mapStateToProps)(CountApp);
```
这里的 connect 来自 react-redux。

#### 路由

接收到 url 之后决定渲染哪些 Component，这是由路由决定的。

这个需求只有一个页面，路由的部分不需要修改。

```
app.router(({history}) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);
```
#### 样式
默认是通过 css modules 的方式来定义样式，这和普通的样式写法并没有太大区别，由于之前已经在 Component 里 hook 了 className，这里只需要在 index.less 里填入以下内容：

```
.normal {
  width: 200px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 20px #ccc;
}

.record {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  color: #ccc;
}

.current {
  text-align: center;
  font-size: 40px;
  padding: 40px 0;
}

.button {
  text-align: center;
  button {
    width: 100px;
    height: 40px;
    background: #aaa;
    color: #fff;
  }
}
```
#### 异步处理

在此之前，我们所有的操作处理都是同步的，用户点击 + 按钮，数值加 1

现在我们要开始处理异步任务，dva 通过对 model 增加 effects 属性来处理 side effect(异步任务)，这是基于 redux-saga 实现的，语法为 generator

在这个需求里，当用户点 + 按钮，数值加 1 之后，会额外触发一个 side effect，即延迟 1 秒之后数值 1 。

```
app.model({
  namespace: 'count',
+ effects: {
+   *add(action, { call, put }) {
+     yield call(delay, 1000);
+     yield put({ type: 'minus' });
+   },
+ },
...
+function delay(timeout){
+  return new Promise(resolve => {
+    setTimeout(resolve, timeout);
+  });
+}

```

* *add() {} 等同于 add: function*(){}
* call 和 put 都是 redux-saga 的 effects，call 表示调用异步函数，put 表示 dispatch action，其他的还有 select, take, fork, cancel 等，详见 redux-saga 文档
* 默认的 effect 触发规则是每次都触发(takeEvery)，还可以选择 takeLatest，或者完全自定义 take 规则

#### 订阅键盘事件
> 在实现了鼠标测速之后，怎么实现键盘测速呢?

在 dva 里有个叫 subscriptions 的概念，他来自于 elm。

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

dva 中的 subscriptions 是和 model 绑定的。

```
+import key from 'keymaster';
...
app.model({
  namespace: 'count',
+ subscriptions: {
+   keyboardWatcher({ dispatch }) {
+     key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
+   },
+ },
});
```

这里我们不需要手动安装 keymaster 依赖，在我们敲入 import key from 'keymaster'; 并保存的时候，dva-cli 会为我们安装 keymaster 依赖并保存到 package.json 中

#### 构建应用

我们已在开发环境下进行了验证，现在需要部署给用户使用。敲入以下命令：


```
$ npm run build
```


输出:


```
> @ build /private/tmp/dva-quickstart
> atool-build

Child
    Time: 6891ms
        Asset       Size  Chunks             Chunk Names
    common.js    1.18 kB       0  [emitted]  common
     index.js     281 kB    1, 0  [emitted]  index
    index.css  353 bytes    1, 0  [emitted]  index
```

该命令成功执行后，编译产物就在 dist 目录下。

## 应用源码

应用源码：[github地址](https://github.com/krislee94/DVA_DEMO/tree/master/myapp)


## 参考链接

[dva-cli github地址](https://github.com/dvajs/dva-cli)
[dva.js 知识导图](https://github.com/dvajs/dva-knowledgemap)
[dva 快速上手](https://github.com/dvajs/dva-docs/blob/master/v1/zh-cn/getting-started.md)
    




