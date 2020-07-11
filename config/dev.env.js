'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"http://zjswzhjy2.csceccloud.net:30888"'//江阴项目
  // API:'"http://wes.csceccloud.net:30888"'//溧阳项目
})
