const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverseAST = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
const defcfg = require('./babelrc.json')

let ID = 0

module.exports = class Asset {
	constructor(file) {
		this.id = ID++
		this.file = file
		this.abspath = null
		this.dirname = null
		this.source = fs.readFileSync(file, 'utf-8')
		this.ast = babylon.parse(this.source, {
			sourceType: 'module'
		})
		this.dependencies = new Set()
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
		this.code = null
	}
	transform(cfg = defcfg) {
		this.ast = transformFromAst(this.ast, null, cfg).ast
	}
	compile(cfg = defcfg) {
		return this.code || (this.code = transformFromAst(this.ast, null, cfg).code)
	}
}
