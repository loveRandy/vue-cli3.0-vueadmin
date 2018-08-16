# vue-cli3.0-vueadmin
  技术栈主要使用vue-cli3.0+vue+elementUI+vuex+axios。<br>
  这是一个基于手摸手系列，<a target="_blank" href="https://github.com/PanJiaChen/vueAdmin-template">vueadmin-template</a>进行改造的版本----感谢作者风骚花裤衩。
  
  由于是基于vue-cli3.0为基础进行的开发，所以同比vue-cli2会有区别：<br>
  1、项目的目录结构发生了变化，vue-cli3.0隐藏了webpack的配置文件，目录看起来非常的清爽简洁，在目标上追求0配置进行开发，将大部分时间用在开发上，避免在配置上浪费过多时间。但是个人风格配置无法避免，这里提供了一个<a href="https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md">vue.config.js</a>进行项目的配置；<br>
 
 2、使用vue ui命令就可以呼唤出vue的图形化界面，可以直接在页面上操控项目的配置，这逼格一下上了天。<br>
 ![Image text](https://randy168.com/屏幕快照%202018-08-15%20下午11.04.14.png)  <br>
 
 
 注意事项：<br>
 1、由于个人风格原因，该项目去掉了eslint限制，需要的同学可以自己增加；<br>
 2、项目里没有使用到原作者的svg组件，因为配置问题导致一直报错，所以改用了iconfont;<br>
 3、为了跑通整个项目，这里我使用nodejs写了几个接口进行验证，包括token、userinfo、list，并且使用cors开放了跨域，需要的同学可以直接使用，无需代理；
 
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and minifies for production to analyze the component percent
```
npm run analyze
```
 
