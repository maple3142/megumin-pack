const runtime = `(function(modules){
	var cache={}
	function require(id){
		if(id in cache)return cache[id]
		var fn=modules[id]
		var module={exports:{}}
		fn(require,module,module.exports)
		return cache[id]=module.exports
	}
	require(0)
})`
module.exports = modules => {
	const modulesCode = modules.map(mod => `function(require,module,exports){${mod.compile().code}}`).join(',')
	const code = `${runtime}([${modulesCode}])`
	return code
}
