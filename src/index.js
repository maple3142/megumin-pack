const fs = require('fs-extra')
const path = require('path')
const createModules = require('./modules')
const createBundle = require('./bundle')

const cwd = process.cwd()
const [entry, dest] = process.argv.slice(2)

const ENTRY = path.join(cwd, entry)
const DEST = path.join(cwd, dest)

createModules(ENTRY)
	.then(createBundle)
	.then(code => fs.writeFile(DEST, code, 'utf-8'))
