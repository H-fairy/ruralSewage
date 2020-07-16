# zhjy

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
###开发环境

Node.js

### 开发调试

修改主机地址：config/dev.env.js文件中的API 属性

npm install （一般仅第一次运行前）

npm run start 



### 打包部署

1. 修改主机地址：
   1. 测试环境：config/test.env.js 文件中的 API：属性
   2. 正式环境：config/prod.env.js 文件中的API 属性
2. 运行打包命令：
   1. 测试环境：npm run build--test 
   2. 正式环境：npm run build--prod
3. 修改dist/index.html：引用文件改为相对路径：即使用 "./"开头。
4. 压缩并上传dist 文件夹到服务器对应目录
5. 在服务器解压并替换旧版本文件



### 部署服务器

**服务器：**

​	**IP：** 10.0.151.40

​	**user:**  root

​	**password:** root@123

**部署位置：**

​	**江阴：**

​		**测试：**/usr/share/nginx/html/site_manage_test/

​		**正式：**/usr/share/nginx/html/site_manage_prod/

​	**溧阳：**

​		**测试：**/usr/share/nginx/html/liyang/site_manage_test/

​		**正式：**/usr/share/nginx/html/liyang/site_manage_prod/