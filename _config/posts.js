'use strict'

const fs = require('fs')
const config = require('_config')
const parser = require('parser')

let custom = []

let files = fs.readdirSync('posts')
files.forEach(file => {
  custom.push(parser('posts', file))
})

module.exports = custom