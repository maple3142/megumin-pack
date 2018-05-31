const fs = require('fs-extra')
const path = require('path')
const babylon = require('babylon')
const traverseAST = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
const defcfg = require('./babelrc.json')

let ID = 0

module.exports = class Asset {
	static from(file) {
		return fs.readFile(file, 'utf-8').then(code => new Asset(file, code))
	}
	constructor(file, source) {
		this.id = ID++
		this.file = file
		this.dirname = path.dirname(file)
		this.source = source
		this.code = null
		this.ast = babylon.parse(this.source, {
			sourceType: 'module'
		})
		this.dependencies = new Set()
		this.addDependencides()
	}
	addDependencides() {
		traverseAST(this.ast, {
			ImportDeclaration: ({ node }) => {
				this.dependencies.add(path.normalize(node.source.value))
			},
			CallExpression: ({ node }) => {
				if (
					node.callee.name === 'require' &&
					node.arguments.length === 1 &&
					node.arguments[0] &&
					node.arguments[0].type === 'StringLiteral'
				) {
					this.dependencies.add(path.normalize(node.arguments[0].value))
				}
			}
		})
		return this
	}
	transform(cfg = defcfg) {
		this.ast = transformFromAst(this.ast, null, cfg).ast
		return this
	}
	compile(cfg = defcfg) {
		this.code = transformFromAst(this.ast, null, cfg).code
		return this
	}
}
