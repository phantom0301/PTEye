# PTEye(coding) #

PTeye(Phantom eye) 是一个代理漏洞审计工具集，使用 NodeJS 结合开源框架（整体框架根据 fwon 的 electron-anyproxy 项目魔改而成 [https://github.com/fwon/electron-anyproxy](https://github.com/fwon/electron-anyproxy "https://github.com/fwon/electron-anyproxy") ）完成，主要用于模块化的业务逻辑漏洞审计。

PTeye 初步设计为使用代理+插件的方式重点对业务逻辑漏洞进行半自动化/被动化的审计。

PTeye仅供交流学习使用，请勿用于非法行为。

<img src="http://phantom0301.cc/achiveimg/20170901103835.jpg" style="position: relative;left: 50%;transform: translate(-50%,0%);" />


## Features ##

1. 沿用原项目的网络抓包以及数据拦截修改功能。
2. 完成了简单的报文重放功能。
3. 根据网络抓包可进行重放报文选择。
4. 基于 AnyProxy Rule 漏洞模块拦截规则编写。

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

可下载已经打好的包（建议自己打包，我也不记得是不是在打好的包里放了什么不该放的东西：



## 工具展示 ##

### 开启代理 ###

![](https://github.com/phantom0301/PTEye/blob/master/img/1.PNG)

### 加载漏洞插件  ###

![](https://github.com/phantom0301/PTEye/blob/master/img/2.PNG)

### 报文重放 ###

![](https://github.com/phantom0301/PTEye/blob/master/img/3.PNG)


## Update1.0 ##

1. 基本框架完成


### Other ###

Issues submit
