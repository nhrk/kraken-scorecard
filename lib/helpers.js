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
			return !(/^(?:www|).?espncricinfo.com/.test(host));
		},
		// IND, AUS, PAK, SL, GULF, EAP
		isRegionA: function(cluster) {
			var regions = {
				'ind': 1,
				'aus': 1,
				'pak': 1,
				'sl': 1,
				'gulf': 1,
				'eap': 1
			};
			return regions.hasOwnProperty(cluster) ? true : false;
		},

		// UK, NZ, WI, WWW
		isRegionB: function(cluster) {
			var regions = {
				'uk': 1,
				'nz': 1,
				'wi': 1,
				'www': 1
			};
			return regions.hasOwnProperty(cluster) ? true : false;
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
		getClientIP: function(req) {
			return (req.headers['True-Client-IP'] || req.headers['x-forwarded-for'] || (req.connection.remoteAddress === '127.0.0.1' ? '199.88.194.29' /*'27.4.80.197' '116.72.156.25'*/ : req.connection.remoteAddress));
		},
		Timer: require('./Timer.js'),
		geo: require('./geo.js')

	};
}());