/*jshint maxcomplexity:13, maxstatements:20 */
'use strict';

module.exports = (function() {

	var config = require('./config.js'),
		ip = require('ip');

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
			return regions[cluster] ? true : false;
		},

		// UK, NZ, WI, WWW
		isRegionB: function(cluster) {
			var regions = {
				'uk': 1,
				'nz': 1,
				'wi': 1,
				'www': 1
			};
			return regions[cluster] ? true : false;
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
			// if private IP use default uk - '80.168.92.194' ind - '115.249.190.165'
			return req.headers['True-Client-IP'] || req.headers['x-forwarded-for'] || (ip.isPrivate(req.connection.remoteAddress) ? '115.249.190.165' : req.connection.remoteAddress);
		},
		Timer: require('./Timer.js'),
		geo: require('./geo.js')

	};
}());