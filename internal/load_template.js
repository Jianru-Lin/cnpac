var fs = require('fs')
var path = require('path')

module.exports = function() {
	return fs.readFileSync(template_filename(), 'utf8')
}

function template_filename() {
	return path.resolve(__dirname, '../template/template.pac')
}