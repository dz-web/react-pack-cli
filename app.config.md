## app.config.js 文件参数

### server `<Object>`
本地服务器配置

```js
server: {
	host: 'localhost', // IP 地址
	port: 8000, // 端口号，发布模式的端口号为 port+1，即：8001
}
```

### copyFile `<array>`
复制静态文件至dist目录

```js
copyFile: [
	{ from: './single_part', to: './' }, // 复制整个目录
	{ from: './config.js', to: './config.js' }, // 复制文件
]
```

### html `<array|Object>`
根据参数动态生成一个或多个html文件

参数|类型|说明
---|---|---
title|`string`|标题
meta|`Array<Object>`|插入到head标签中的meta标签
links|`Array<string|Object>`|插入到head标签中的link标签
scripts |`Array<string|Object>`|插入到body标签尾部的script标签
baseHref|`string`|插入到head标签顶部的base标签，主要用于多路由下的资源相对路径问题

```js

html: [
	{
	  title: '视频直播',
	  baseHref: 'http://localhost:8000/',
	  meta:[
	  	{ 'http-equiv':'X-UA-Compatible', content:'IE=EDGE' }
	  ],
	  links: [
	    './static/bootstrap_part.min.css',
	    { href:'./static/bootstrap-datetimepicker.min.css', id:'dtcss' }
	  ],
	  scripts: [
	    './config.js',
	    './static/TweenLite.min.js',
	    { src:'./static/TweenLite.min.js', id:'tween' }
	  ],
	}
]
```

### entry `<string|array>`
整个Web程序入口文件

* 单入口

	```js
	entry: './src/index'
	```

* 多入口

	```js
	entry: {
		index: './src/index',
		login: './src/single-page/login',
		reg: './src/single-page/reg',
		reset: './src/single-page/reset'
	}
	```

### template `<string>`

```js
template: `./dev/template/index.pug`,
```

### filename `<string>`
生成的html文件名

```js
filename: `index.html`,
```