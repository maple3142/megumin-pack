module.exports = modules => {
	const modulesCode = modules.map(mod => `function(require,module,exports){${mod.compile()}}`).join(',')
	const code = `
		(function(modules){
			var cache={}
			function require(id){
				if(id in cache)return cache[id]
				const fn=modules[id]
				const module={exports:{}}
				fn(require,module,module.exports)
				return cache[id]=module.exports
			}
			require(0)
		})([${modulesCode}])`
	return code
}
