const fs = require('fs')
const path = require('path')
const createModules = require('./modules')
const createBundle = require('./bundle')

const ENTRY = path.join(__dirname, '../example/index.js')
const DEST = path.join(__dirname, '../dist/app.js')

const m = createModules(ENTRY)
const code = createBundle(m)

fs.writeFileSync(DEST, code, 'utf-8')
