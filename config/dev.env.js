'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


// golang,张伟：http://10.8.220.171:8080/
// php,刘波成：http://10.8.220.236:8080/

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

})
