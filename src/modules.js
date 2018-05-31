const path = require('path')
const Asset = require('./asset')

module.exports = async entry => {
	const main = await Asset.from(entry)

	const depsMap = new Map()
	const modules = [main]
	for (const asset of modules) {
		for (const dep of asset.dependencies) {
			const childPath = path.join(asset.dirname, dep)
			const child = await Asset.from(childPath)

			depsMap.set(childPath, child.id)
			modules.push(child)
		}

		// compile & require('./xxx.js') -> require(ID)
		asset.transform().traverseAST({
			CallExpression: ({ node }) => {
				if (
					node.callee.name === 'require' &&
					node.arguments.length === 1 &&
					node.arguments[0] &&
					node.arguments[0].type === 'StringLiteral'
				) {
					const deppath = path.join(asset.dirname, node.arguments[0].value)
					node.arguments[0].rawValue = node.arguments[0].value = depsMap.get(deppath)
				}
			}
		})
	}
	return modules
}
