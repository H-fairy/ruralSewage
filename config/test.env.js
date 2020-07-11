'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API: '"http://zjswzhjy2.csceccloud.net:30888"'//江阴项目
  // API:'"http://wes.csceccloud.net:30888"'//溧阳项目
})
