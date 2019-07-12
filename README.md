# vue-admin-permission
项目基于vue-cli3.0进行搭建，并使用了vue全家桶vue vuex axios vue-router elementui，增加了按钮级别的权限控制

#
<h2><a href="http://www.vueadmin.cn">线上地址</a></h2>
## Project setup（安装包）
```
这里需要使用npm进行安装，如果用cnpm或者yarn会有热更新失效的问题
npm install
```

## Compiles and hot-reloads for development（运行项目）
```

npm run serve:randy  

```

## Compiles and minifies for production（打包）
```
如果是首次打包或者第三方库文件发生变更，则需要先运行 npm run dll,用于抽离第三方库如vue vuex axios element-ui，此后直接运行npm run build即可

npm run build
```
## analyze your items （项目模块分析）
```
npm run analyze
```
## 温馨提示
```
在新增vue页面的时候，热更新可能会失效，重启一下项目
```
## Run your tests
```
yarn run test
```

## Lints and fixes files
```
yarn run lint
```

## Run your unit tests
```
yarn run test:unit
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
