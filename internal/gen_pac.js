var assert = require('assert')
var fs = require('fs')
var path = require('path')

module.exports = function(code) {
	assert(typeof code === 'string')
	fs.writeFileSync(pac_filename(), code)
}

function pac_filename() {
	return path.resolve(__dirname, '../out.pac')
}