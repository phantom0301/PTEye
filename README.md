# PTEye(coding) #

PTeye(Phantom eye) 是一个代理黑盒漏洞审计工具，使用 NodeJS 结合开源框架（整体框架根据 fwon 的 electron-anyproxy 项目魔改而成 [https://github.com/fwon/electron-anyproxy](https://github.com/fwon/electron-anyproxy "https://github.com/fwon/electron-anyproxy") ）完成，主要用于插件式的漏洞审计。

PTeye 初步设计为使用被动代理+插件的方式重点对相关漏洞进行半自动化/被动化的审计。

PTeye仅供交流学习使用，请勿用于非法行为。

<img src="http://phantom0301.cc/achiveimg/20170901103835.jpg" style="position: relative;left: 50%;transform: translate(-50%,0%);" />


## Features ##

1. 沿用原项目的网络抓包以及数据拦截修改功能。
2. 完成了简单的报文重放功能。
3. 根据网络抓包可进行重放报文选择。
4. 基于 AnyProxy Rule 漏洞模块拦截规则编写，Rule 规则编写可以参考已有的插件，详细规则可参考 [http://anyproxy.io/](http://anyproxy.io/ "http://anyproxy.io/")。

```
module.exports = {
  // 模块介绍
  summary: 'my customized rule for AnyProxy',
  // 发送请求前拦截处理
  *beforeSendRequest(requestDetail) { /* ... */ },
  // 发送响应前处理
  *beforeSendResponse(requestDetail, responseDetail) { /* ... */ },
  // 是否处理https请求
  *beforeDealHttpsRequest(requestDetail) { /* ... */ },
  // 请求出错的事件
  *onError(requestDetail, error) { /* ... */ },
  // https连接服务器出错
  *onConnectError(requestDetail, error) { /* ... */ }
};
```


## Usage ##

可参考原项目相关介绍

### 开发模式 ###

- 下载源代码
- 在 client 目录中安装相关模块，启动 element-ui 前端

``` 
npm install (or yarn)
npm run dev
```

- 在根目录下同时安装相关模块，启动 electron 环境，设置相关环境变量（main.js 中第 29 行）。

```
npm install (or yarn)
npm run start
```

- 开发完成后，对前端代码进行编译，对后端代码进行打包

```
client 目录下：
npm run build
根目录下：
npm run pack
```

### 直接使用 ###

可下载已经打好的包（建议自己打包，我也不记得是不是在打好的包里放了什么不该放的东西:

[https://github.com/phantom0301/PTEye/releases](https://github.com/phantom0301/PTEye/releases "https://github.com/phantom0301/PTEye/releases")

1. 在主界面右侧工具栏可以配置代理基本信息，下载 https 证书。
2. 配置完成后即可启动监听，由于实现机制，暂时没有实现 burp 里的 proxy intercept 功能，只能在抓包列表栏观察所有的报文。
3. 逐行点击相关的报文可以弹出报文详细信息。
4. 点击重放按钮可以将相应的报文请求包发送到请求重放功能框中，实现类似的 repeater 功能。
5. 在请求重放功能中，左侧填写任意请求头和请求体信息，右上侧填写发送地址，右侧输出响应返回包。
6. 漏洞检测插件一次只能加载一个模组，并且加载后需要重启代理（右上的基本配置栏可以有重启按钮，或者点击关闭代理后重新打开） 



## 工具展示 ##

### 开启代理 ###

![](https://github.com/phantom0301/PTEye/blob/master/img/1.PNG)

### 加载漏洞插件  ###

![](https://github.com/phantom0301/PTEye/blob/master/img/2.PNG)

### 报文重放 ###

![](https://github.com/phantom0301/PTEye/blob/master/img/3.PNG)


## Update1.0 ##

1. 基本框架完成，部分功能还需优化（intercept 功能，多插件规则合并生效功能）


### Other ###

Issues submit
