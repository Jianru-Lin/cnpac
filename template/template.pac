function FindProxyForURL(url, host) {
  if (!isResolvable(host)) {
    return #PROXY#
  }

  var resolved_host = dnsResolve(host)

  if (!is_ipv4(resolved_host)) {
    return "DIRECT"
  }

  var resolved_host_int = ipv4_to_int(resolved_host)
  if (is_special()) return #PROXY#
	else if (is_local() || is_cn() || is_unproxyable()) return "DIRECT"
  else return #PROXY#

  function is_special() {
    if (/google/i.test(url)) return true
    if (/youtube/i.test(url)) return true
    if (/facebook/i.test(url)) return true
    if (/fbcdn/i.test(url)) return true
    if (/twitter/i.test(url)) return true

    // [[ip,mask],...]
    var list = #SPECIAL_LIST#
    for (var i = 0, len = list.length; i < len; ++i) {
      var ip = list[i][0]
      var mask = list[i][1]
      if (isInNet(resolved_host, ip, mask)) {
        return true
      }
    }
    return false
  }

  function is_local() {
    // [[ip,mask],...]
    var list = #LOCAL_LIST#
    for (var i = 0, len = list.length; i < len; ++i) {
      var ip = list[i][0]
      var mask = list[i][1]
      if (isInNet(resolved_host, ip, mask)) {
        return true
      }
    }
    return false
  }

  function is_cn() {
    // [[min,max],...]
    var list = #CN_LIST#
    for (var i = 0, len = list.length; i < len; ++i) {
      var min = list[i][0]
      var max = list[i][1]
      if (ipv4_in_range(resolved_host_int, min, max)) {
        return true
      }
    }
    return false
  }

  function is_unproxyable() {
    if (/discussions\.apple\.com/i.test(url)) return true
    if (/icloud/i.test(url)) return true
    if (/itunes\.apple\.com/i.test(url)) return true
  }

  function is_ipv4(ip) {
    return /^\d+\.\d+\.\d+\.\d+$/.test(ip)
  }

  function ipv4_to_int(ipv4) {
    return ipv4.split('.').map(function (p) {
      return parseInt(p)
    })
  }

  // ipv4 >= min && ipv4 <= max
  function ipv4_in_range(ipv4, min, max) {
    return ipv4_ge(ipv4, min) && ipv4_le(ipv4, max)
  }

  // a > b ::  1
  // a = b ::  0
  // a < b :: -1
  function compare_ipv4(a, b) {
    if (a[0] > b[0]) return 1
    else if (a[0] < b[0]) return -1

    if (a[1] > b[1]) return 1
    else if (a[1] < b[1]) return -1

    if (a[2] > b[2]) return 1
    else if (a[2] < b[2]) return -1

    if (a[3] > b[3]) return 1
    else if (a[3] < b[3]) return -1
    else return 0
  }

  // a <= b :: true
  // else   :: false
  function ipv4_le(a, b) {
    return compare_ipv4(a, b) !== 1
  }

  // a >= b :: true
  // else   :: false
  function ipv4_ge(a, b) {
    return compare_ipv4(a, b) !== -1
  }
}
