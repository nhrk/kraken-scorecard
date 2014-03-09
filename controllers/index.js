/*jshint maxcomplexity:18, maxstatements:30 */
'use strict';

var request = require('request'),
	mime = require('node-mime'),
	uname = new Buffer('bmloYXJr=', 'base64').toString('ascii'),
	pass = new Buffer('Q0lpcGwyMDEw=', 'base64').toString('ascii'),
	cache = {},
	cacheDuration = 10000;

module.exports = function(app) {

	/* A very naive timer */
	function Timer(name){
		if( !(this instanceof Timer) ){
			return new Timer(name);
		}
		this.name = name;
		this.start();
	}

	Timer.prototype.start = function(){
		this.start = new Date();
	};

	Timer.prototype.end = function(){
		this.end = new Date();
		return this.time();
	};

	Timer.prototype.time = function(){
		return {
			name : this.name,
			time : (this.end - this.start) + ' ms'
		};
	};

	app.get('/', function(req, res) {

		res.render('index', {url : '/live/id/:id', domain: 'domain'});

	});

	app.get('/live/id/:id', function(req, res) {

		var id = req.param('id') || 578625,
			protcol = 'http://',
			host = req.param('host') || 'kilimanjaro.espncricinfo.com',
			auth = false,
			path = '/ci/engine/match',
			url,
			cacheEnabled = req.param('cache');

		if(/localcms|dev|hq/.test(host)){
			auth = true;
		}

		url = protcol + (auth ? uname + ':' + pass + '@' : '') +  host + path + '/' + id + '.json?base=' + (req.param('base') || 1);

		if(cacheEnabled){
			cache[url] = cache[url] || {};

			if(cache[url].data && (new Date() - cache[url].time < cacheDuration)){
				res.render('scorecard', cache[url].data);
				return;
			}
		}

		var requestTime = Timer('requestTime');

		request(url, function request(er, response, body) {

			requestTime.end();

			if (!er && response.statusCode === 200) {

				var json = JSON.parse(body);

				// Append server details
				json.date = Date();
				json.platform = global.process.title + ' ' + global.process.version;

				json.match.match_status = (json.match.match_status === 'complete') ? 1 : 0;
				json.domain = protcol + host;

				/*TODO: update hardcoded value*/
				json.cluster = req.param('cluster') || json.cluster || 'ind';
				json.isUSA = json.cluster === 'usa' ? true : false;
				/*TODO: change ci to url component*/
				json.uri = 'www.espncricinfo.com' + '/ci/engine/match/' + json.matchId + '.html';
				json.page_url = protcol + json.uri;

				if(req.param('ns')){
					json.ENABLE_NETSTORAGE = req.param('ns');
				}

				if(req.param('ep')){
					json.Env_SERVER_NAME = req.param('ep');
				}

				if(json.match.bitly_hash){
					json.twt_url = 'http://es.pn/' + json.match.bitly_hash;
				}else{
					json.twt_url = json.page_url;
				}

				if (json.country === 'gb') {
					json.cqanswer = 'uk';
				} else if (json.country === 'unknown') {
					json.cqanswer = '99';
				} else {
					json.cqanswer = json.country;
				}

				if(json.cluster === 'ind' || json.cluster === 'aus' || json.cluster === 'pak' || json.cluster === 'sl' || json.cluster === 'gulf' || json.cluster === 'eap'){
					json.lhs_615 = true;
					json.rhs_310 = true;
				}

				if(req.param('time')){
					json.requestTime = requestTime.time().time;
				}

				if(cacheEnabled){
					cache[url].data = cache[url].data || json;
					cache[url].time = new Date();
				}


				res.render('scorecard', json);
			} else {
				res.render('errors/500');
			}
		});
	});

	app.get('/proxy', function(req, res) {

		var url = req.param('url');

		if(/hq/.test(url)){
			url = 'http://' + uname + ':' + pass + '@' + url.split('http://')[1];
		}

		request.get(url, function(err, re, body) {

			if (!err) {

				res.setHeader('Content-Type', re.headers['content-type']);
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Cache-Control','max-age=10');

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
