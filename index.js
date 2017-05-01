process.env['DEBUG'] = 'cnpac'

const dbg = require('debug')('cnpac')
const cnip = require('cnip')
const load_template = require('./internal/load_template')
const fill_template = require('./internal/fill_template')
const gen_pac = require('./internal/gen_pac')

dbg('load ip data..')
cnip.load()
	.then((cn_ipv4_records) => {
		dbg('load template...')
		var template = load_template()
		dbg('fill template...')
		var code = fill_template(template, cn_ipv4_records)
		dbg('generate pac...')
		gen_pac(code)
		dbg('ok, see out.pac')
	})
	.catch((err) => {
		dbg(err.message)
	})