/*jshint maxcomplexity:24, maxstatements:38 */
'use strict';

module.exports = function(app) {

	var request = require('request'),
		mime = require('node-mime'),
		helpers = require('../lib/helpers.js'),
		config = require('../lib/config.js'),
		uname = config.uname,
		pass = config.pass,
		cache = {};

	// Homepage
	app.get('/', function(req, res) {

		res.render('index', {
			url: '/match/:id'
		});

	});

	// Live Scorecard
	app.get('/match/:id', function(req, res) {

		var id = req.param('id') || null /* || 578625*/ ,
			protcol = 'http://',
			host = req.param('host') || 'www.espncricinfo.com' /*|| 'kilimanjaro.espncricinfo.com'*/ ,
			path = '/ci/engine/match',
			ip = (req.headers['True-Client-IP'] || req.headers['x-forwarded-for'] || (req.connection.remoteAddress === '127.0.0.1' ? '116.72.156.25' /*'27.4.80.197' '199.88.194.29'*/ : req.connection.remoteAddress)),
			geoData = helpers.geo.parse(ip),
			cluster = geoData.cluster,
			country = geoData.country,
			layout = req.param('layout') || 'live2optimized',
			cacheEnabled = ( !! req.param('cache')),
			requestTime,
			url;

		url = helpers.getEndpoint({
			host: host,
			path: path,
			id: id,
			base: (req.param('base') || 1),
			cluster: (req.param('cluster') || cluster),
			country: (req.param('country') || country)
		})

		// Cache JSON in memory
		if (cacheEnabled) {
			cache[url] = cache[url] || {};

			if (cache[url].data && (new Date() - cache[url].time < config.cacheDuration)) {
				res.render(layout, cache[url].data);
				return;
			}
		}

		// console.log(url); /*'http://www.espncricinfo.com/ci/engine/match/578625.json?base=1;cluster=ind;country=in'*/

		requestTime = helpers.Timer('requestTime');

		request.get({
			url: url,
			json: true
		}, onComplete);

		function onComplete(er, response, json) {

			console.log(requestTime.end());

			if (!er && response.statusCode === 200) {

				json.platform = global.process.title + ' ' + global.process.version;

				json.date = new Date();

				json.match.match_status = (json.match.match_status === 'complete') ? 1 : 0;

				json.domain = protcol + host;

				json.crossOriginRequest = helpers.isCrossOrigin(req.headers.host);

				json.cluster = (req.param('cluster') || cluster || 'ind');

				json.country = (req.param('country') || country || 'in');

				/*TODO: change ci to url component*/
				json.uri = host + path + '/' + json.matchId + '.html';

				json.page_url = protcol + json.uri;

				json.twt_url = helpers.getTwitterUrl(json.match.bitly_hash, json.page_url);

				json.cqanswer = helpers.getCQanswer(json.country);

				json.lhs_615 = json.rhs_310 = helpers.isRegionA(json.cluster);

				json.showBet365 = helpers.isRegionB(json.cluster);

				if (req.param('time')) {
					json.requestTime = requestTime.time().time;
				}

				// Cache into memory
				if (cacheEnabled) {
					cache[url].data = cache[url].data || json;
					cache[url].time = new Date();
				}

				res.render(layout, json);

			} else {
				res.render('errors/500');
			}
		}
	});

	// Redirect for older URL format
	app.get('/live/id/:id', function(req, res) {

		// Permanent redirect to new location
		res.writeHead(301, {
			Location: '/match/' + req.param('id') + (req._parsedUrl.search || '')
		});
		res.end();

		return;
	});

	// Simple Proxy with CORS support
	app.get('/proxy', function(req, res) {

		var url = req.param('url');

		if (helpers.isAuthRequired(url)) {
			url = 'http://' + uname + ':' + pass + '@' + url.split('http://')[1];
		}

		request.get(url, function(err, re, body) {

			if (!err) {

				res.setHeader('Content-Type', re.headers['content-type']);
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Cache-Control', 'max-age=10');

				if (mime.types[re.headers['content-type'].split(';')[0]] === 'map') {
					res.json(JSON.parse(body));
				} else {
					res.end(body);
				}

			} else {
				res.render('index');
			}
		});
	});
};