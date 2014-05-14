/*jshint maxcomplexity:13, maxstatements:20 */
'use strict';

module.exports = (function() {

	var config = require('./config.js');

	return {
		isAuthRequired: function(host) {
			if (/localcms|dev|hq/.test(host)) {
				return true;
			}
			return false;
		},
		isCrossOrigin: function(host) {
			return !(/^espncricinfo.com|^www.espncricinfo.com/.test(host));
		},
		// IND, AUS, PAK, SL, GULF, EAP
		isRegionA: function(cluster) {
			if (cluster === 'ind' || cluster === 'aus' || cluster === 'pak' || cluster === 'sl' || cluster === 'gulf' || cluster === 'eap') {
				return true;
			}
			return false;
		},

		// UK, NZ, WI, WWW
		isRegionB: function(cluster) {
			if (cluster === 'uk' || cluster === 'nz' || cluster === 'wi' || cluster === 'wwww') {
				return true;
			}
			return false;
		},
		getEndpoint: function(params) {
			var host = params.host,
				path = params.path,
				id = params.id,
				base = params.base,
				cluster = params.cluster,
				country = params.country,
				authRequired = this.isAuthRequired(host),
				uname = config.uname,
				pass = config.pass;

			return 'http://' + (authRequired ? uname + ':' + pass + '@' : '') + host + path + '/' + id + '.json' + '?base=' + (base || 1) + ';cluster=' + cluster + ';country=' + country;
		},
		getTwitterUrl: function(bitly_hash, page_url) {
			var url = '';
			if (bitly_hash) {
				url = 'http://es.pn/' + bitly_hash;
			} else {
				url = page_url;
			}
			return url;
		},
		getCQanswer: function(country) {
			var cqanswer;
			if (country === 'gb') {
				cqanswer = 'uk';
			} else if (country === 'unknown') {
				cqanswer = '99';
			} else {
				cqanswer = country;
			}
			return cqanswer;
		},
		Timer: require('./Timer.js'),
		geo: require('./geo.js')

	};
}());