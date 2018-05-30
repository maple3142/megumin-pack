const path = require('path')
const traverseAST = require('babel-traverse').default
const Asset = require('./asset')

module.exports = entry => {
	const main = new Asset(entry)
	main.abspath = entry
	main.dirname = path.dirname(entry)

	const depmap = new Map()
	const queue = [main]
	for (const asset of queue) {
		const dirname = path.dirname(asset.file)
		for (const dep of asset.dependencies) {
			const childPath = path.join(dirname, dep)
			const child = new Asset(childPath)
			child.abspath = childPath
			child.dirname = path.dirname(childPath)

			depmap.set(childPath, child.id)
			queue.push(child)
		}
		asset.transform()
		traverseAST(asset.ast, {
			CallExpression: ({ node }) => {
				if (
					node.callee.name === 'require' &&
					node.arguments.length === 1 &&
					node.arguments[0] &&
					node.arguments[0].type === 'StringLiteral'
				) {
					const deppath = path.join(asset.dirname, node.arguments[0].value)
					node.arguments[0].rawValue = node.arguments[0].value = depmap.get(deppath)
				}
			}
		})
	}
	return queue
}
