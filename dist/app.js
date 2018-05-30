
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
		})([function(require,module,exports){"use strict";

var _msg = require(1);

var _msg2 = _interopRequireDefault(_msg);

var _msg3 = require(1);

var _msg4 = _interopRequireDefault(_msg3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_msg2.default);
var msg3 = require(2);
console.log(msg3);},function(require,module,exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hello = require(3);

var _hello2 = _interopRequireDefault(_hello);

var _world = require(4);

var _world2 = _interopRequireDefault(_world);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _hello2.default + " " + _world2.default;

console.log('I only show once.');},function(require,module,exports){"use strict";

module.exports = 'test';},function(require,module,exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'hello';},function(require,module,exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'world';}])