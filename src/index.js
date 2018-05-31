const fs = require('fs-extra')
const path = require('path')
const createModules = require('./modules')
const createBundle = require('./bundle')

const ENTRY = path.join(__dirname, '../example/index.js')
const DEST = path.join(__dirname, '../dist/app.js')

createModules(ENTRY)
	.then(createBundle)
	.then(code => fs.writeFile(DEST, code, 'utf-8'))
