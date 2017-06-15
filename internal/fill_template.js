var assert = require('assert')

module.exports = function(template, cn_ipv4_records) {
	assert(typeof template === 'string')
	
	var proxy = 'PROXY p1.miaodeli.com:38000'
	var special_list = []
	var local_list = [
		['127.0.0.0', '255.0.0.0'],
		['169.254.0.0', '255.255.0.0'],
		['10.0.0.0.', '255.0.0.0'],
		['172.16.0.0', '255.240.0.0'],
		['192.168.0.0', '255.255.0.0']
	]
	var cn_list = cn_ipv4_records.map(make_ip_range)

	return template.replace(/#PROXY#/g, JSON.stringify(proxy))
				   .replace(/#SPECIAL_LIST#/g, JSON.stringify(special_list))
				   .replace(/#LOCAL_LIST#/g, JSON.stringify(local_list))
				   .replace(/#CN_LIST#/g, JSON.stringify(cn_list))
}

function make_ip_range(record) {
	assert(is_ipv4(record.start))
	var min = ipv4_to_int(record.start)
	var max = inc_ipv4(min, parseInt(record.value)-1)
	return [min, max]
}

function is_ipv4(ip) {
	return /^\d+\.\d+\.\d+\.\d+$/.test(ip)
}

function ipv4_to_int(ipv4) {
	return ipv4.split('.').map(function(p) {
		return parseInt(p)
	})
}

function inc_ipv4(ipv4, v) {
	var t = ipv4.slice()
	while (v--) {
		inc()
	}
	return t

	function inc() {
		t[3] += 1
		if (t[3] <= 255) return
		t[3] = 0
		t[2] += 1

		if (t[2] <= 255) return
		t[2] = 0
		t[1] += 1

		if (t[1] <= 255) return
		t[1] = 0
		t[0] += 1

		return t
	}
}